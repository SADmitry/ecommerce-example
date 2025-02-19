require('dotenv').config();
const express = require('express');
const Database = require('better-sqlite3');
const { Queue } = require('bullmq');
const Redis = require('ioredis');

const app = express();
app.use(express.json());

const db = new Database(process.env.DATABASE_PATH || './orders.db');
const redis = new Redis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, maxRetriesPerRequest: null });
console.log('🚀 Order Service is connecting Redis...');
redis.on('error', (err) => console.error('🚨 Redis error:', err));
redis.on('connect', () => console.log('✅ Redis is connected!'));
const orderQueue = new Queue('orderQueue', { connection: redis });

app.post('/orders', async (req, res) => {
    const { user_id, total_price } = req.body;
    if (!user_id || !total_price) return res.status(400).json({ error: 'user_id and total_price are mandatory' });

    const stmt = db.prepare(`INSERT INTO orders (user_id, total_price) VALUES (?, ?)`);
    const result = stmt.run(user_id, total_price);
    const orderId = result.lastInsertRowid;

    console.log(`📦 Order ${orderId} is created`);

    await orderQueue.add('OrderCreated', { orderId, user_id, total_price });

    res.status(201).json({ id: orderId, status: 'pending' });
});

app.get('/orders/:id', (req, res) => {
    const orderId = req.params.id;
    const stmt = db.prepare(`SELECT * FROM orders WHERE id = ?`);
    const order = stmt.get(orderId);

    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
});

app.listen(process.env.PORT, () => console.log(`🚀 Order Service is on port ${process.env.PORT}`));
