const { Worker, Queue } = require('bullmq');
const Redis = require('ioredis');
const axios = require('axios');

const redis = new Redis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, maxRetriesPerRequest: null });
console.log('🚀 Orchestrator is connecting Redis...');
redis.on('error', (err) => console.error('🚨 Redis error:', err));
redis.on('connect', () => console.log('✅ Redis is connected!'));

const orchestratorQueue = new Queue('orchestratorQueue', { connection: redis });

const orchestratorWorker = new Worker('orderQueue', async (job) => {
    console.log(`📥 Orchestrator received event: ${JSON.stringify(job.data)}`);

    if (job.name === 'OrderCreated') {
        console.log(`💳 Sending payment request for order ${job.data.orderId}...`);
        await orchestratorQueue.add('PaymentProcessing', {
            orderId: job.data.orderId,
            total_price: job.data.total_price
        });
        console.log(`✅ Task sent to orchestratorQueue`);
    }
}, { connection: redis });

console.log('🚀 Orchestrator is running');
