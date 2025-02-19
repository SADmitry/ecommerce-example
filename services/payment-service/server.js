require('dotenv').config();
const { Worker } = require('bullmq');
const Redis = require('ioredis');

const redis = new Redis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, maxRetriesPerRequest: null });
console.log('🚀 Payment Service is connecting Redis...');
redis.on('error', (err) => console.error('🚨 Redis error:', err));
redis.on('connect', () => console.log('✅ Redis is connected!'));

const paymentWorker = new Worker('orchestratorQueue', async (job) => {
    console.log(`📥 Payment Service received job: ${JSON.stringify(job.data)}`);

    if (job.name === 'PaymentProcessing') {
        console.log(`💳 Processing payment for order ${job.data.orderId}...`);
        const success = Math.random() > 0.5;

        if (success) {
            console.log(`✅ Payment for order ${job.data.orderId} successful`);
            await job.queue.add('PaymentApproved', { orderId: job.data.orderId });
        } else {
            console.log(`❌ Payment for order ${job.data.orderId} failed`);
            await job.queue.add('PaymentRejected', { orderId: job.data.orderId });
        }
    }
}, { connection: redis });

console.log('🚀 Payment Service is listening for "PaymentProcessing" tasks...');
