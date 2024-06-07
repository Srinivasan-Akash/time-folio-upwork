const { Client, Users, Query } = require('node-appwrite');
const crypto = require('crypto');

module.exports = async (context) => {
  const { req, res, log, error } = context;

  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("664c966b003c00aba212")
    .setKey("ee704fcf107eb14f38ecb7972401d3b6251ca8b68d50ce1badbb087ef44e6209002fe4153090b1fddc2fd1251425ccf68a89e29dde9e61a17e9aede37b24fe813fbbdf8d873e84d01e716ff93321e59bcf22ee3031c0dda37f395bfd67e3f2df448b903985e8fd825dcea848179e353acea2887afce346fc14ee5a6a4f536771");

  const users = new Users(client);

  // Validate webhook signature
  const validateWebhook = (context) => {
    try {
      const secret = 'time-folio';
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
    // if (!validateWebhook(context)) {
    //   return res.json({ success: false }, 401);
    // }

    const order = req.body.data.attributes;
    context.log(order);

    const userEmail = order.user_email;
    if (!userEmail) {
      context.error('User email not found in webhook payload.');
      return res.json({ success: false }, 400);
    }

    try {
      // Search for the user by email
      const searchResult = await users.list([Query.equal("email", [userEmail])	]);
      if (!searchResult || searchResult.users.length === 0) {
        context.error(`User with email ${userEmail} not found.`);
        return res.json({ success: false }, 404);
      }

      // Update user labels
      const user = searchResult.users[0];
      const updatedLabels = [...new Set([...(user.labels || []), 'pro'])];
      await users.updateLabels(user.$id, updatedLabels)
      context.log(`Added "pro" label to user ${user.$id}.`);

      return res.json({ success: true });
    } catch (err) {
      context.error(`Failed to update user: ${err.message}`);
      return res.json({ success: false }, 500);
    }
  } else {
    return res.send('HELLO !!', 200);
  }
};
