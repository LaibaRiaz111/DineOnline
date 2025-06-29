require('dotenv').config();

const config = {
    port: process.env.PORT || 5001,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripePublishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
};

// Validate required configuration
if (!config.stripeSecretKey) {
    console.error('ERROR: Stripe secret key is not configured!');
    console.error('Please set STRIPE_SECRET_KEY environment variable');
    process.exit(1);
}

if (!config.stripeSecretKey.startsWith('sk_')) {
    console.error('ERROR: Invalid Stripe secret key format!');
    console.error('Secret key should start with "sk_"');
    process.exit(1);
}

module.exports = config; 