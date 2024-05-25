const crypto = require('crypto');

module.exports = async function (context) {
    try {
        // Parse the request body (assuming it's JSON)
        const body = JSON.parse(context.req.payload);

        // Catch the event type
        const eventType = context.req.headers['x-event-name'];

        // Check signature
        const secret = 'time-folio-akash';
        const hmac = crypto.createHmac('sha256', secret);
        const digest = Buffer.from(
            hmac.update(context.req.payload).digest('hex'),
            'utf8'
        );
        const signature = Buffer.from(context.req.headers['x-signature'] || '', 'utf8');

        if (!crypto.timingSafeEqual(digest, signature)) {
            throw new Error('Invalid signature.');
        }

        context.log(body);

        // Logic according to event
        if (eventType === 'order_created') {
            const userId = body.meta.custom_data.user_id;
            const isSuccessful = body.data.attributes.status === 'paid';
            // Perform your logic based on the event and user ID here
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Webhook received' })
        };
    } catch (err) {
        context.error(err);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Server error' })
        };
    }
};
