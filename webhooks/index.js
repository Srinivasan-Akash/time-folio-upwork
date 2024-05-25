const crypto = require('crypto');

module.exports = async function (req, res) {
    try {
        // Catch the event type
        const eventType = req.headers['x-event-name'];
        const body = req.body;

        // Check signature
        const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SIGNATURE;
        const hmac = crypto.createHmac('sha256', secret);
        const digest = Buffer.from(
            hmac.update(req.rawBody).digest('hex'),
            'utf8'
        );
        const signature = Buffer.from(req.headers['x-signature'] || '', 'utf8');

        if (!crypto.timingSafeEqual(digest, signature)) {
            throw new Error('Invalid signature.');
        }

        console.log(body);

        // Logic according to event
        if (eventType === 'order_created') {
            const userId = body.meta.custom_data.user_id;
            const isSuccessful = body.data.attributes.status === 'paid';
        }

        res.json({ message: 'Webhook received' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
