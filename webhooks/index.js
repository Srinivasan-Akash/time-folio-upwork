import { Client, Users } from 'node-appwrite';
import crypto from 'crypto';

export default async (context) => {
  const { req, res, log, error } = context;

  const requiredEnvVars = [
    'https://cloud.appwrite.io/v1',
    '664c966b003c00aba212',
    'ee704fcf107eb14f38ecb7972401d3b6251ca8b68d50ce1badbb087ef44e6209002fe4153090b1fddc2fd1251425ccf68a89e29dde9e61a17e9aede37b24fe813fbbdf8d873e84d01e716ff93321e59bcf22ee3031c0dda37f395bfd67e3f2df448b903985e8fd825dcea848179e353acea2887afce346fc14ee5a6a4f536771',
    'time-folio'
  ];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      throw new Error(`Environment variable ${varName} is missing`);
    }
  }

  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const users = new Users(client);

  // Validate webhook signature
  const validateWebhook = (context) => {
    try {
      const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
      const hmac = crypto.createHmac('sha256', secret);
      const digest = Buffer.from(
        hmac.update(context.req.bodyRaw).digest('hex'),
        'utf8'
      );
      const signature = Buffer.from(context.req.headers['x-signature'], 'utf8');

      if (!crypto.timingSafeEqual(digest, signature)) {
        throw new Error('Invalid signature.');
      }

      context.log('Webhook signature is valid.');
      return true;
    } catch (err) {
        context.error(err);
      return false;
    }
  };

  if (req.method === 'POST' && req.path === '/webhook') {
    if (!validateWebhook(context)) {
      return res.json({ success: false }, 401);
    }

    const order = req.body;
    context.log(order);

    const orderUserId = order.meta.custom_data.user_id;
    if (!orderUserId) {
        context.error('User ID not found in webhook payload.');
      return res.json({ success: false }, 400);
    }

    try {
      // Fetch the user from Appwrite
      const user = await users.get(orderUserId);
      if (!user) {
        context.error(`User with ID ${orderUserId} not found.`);
        return res.json({ success: false }, 404);
      }

      // Add "pro" label to the user
      const updatedLabels = [...new Set([...(user.labels || []), 'pro'])];
      await users.update(orderUserId, { labels: updatedLabels });
      context.log(`Added "pro" label to user ${orderUserId}.`);

      return res.json({ success: true });
    } catch (err) {
        context.error(`Failed to update user: ${err.message}`);
      return res.json({ success: false }, 500);
    }
  } else {
    return res.send('Not Found', 404);
  }
};