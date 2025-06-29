const express = require('express');
const cors = require('cors');
const config = require('./config');

console.log('Starting server with Stripe key:', config.stripeSecretKey.substring(0, 12) + '...');

const stripe = require('stripe')(config.stripeSecretKey);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Create payment intent
app.post('/api/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body;
        console.log('Creating payment intent with amount:', amount);
        
        if (!amount || isNaN(amount) || amount <= 0) {
            console.error('Invalid amount:', amount);
            return res.status(400).json({ 
                error: 'Invalid amount provided',
                details: `Amount must be a positive number. Received: ${amount}`
            });
        }

        const amountInCents = Math.round(amount * 100);
        console.log('Amount in cents:', amountInCents);

        // Verify Stripe is properly initialized
        if (!stripe.paymentIntents) {
            console.error('Stripe not properly initialized');
            return res.status(500).json({
                error: 'Payment service not properly configured',
                details: 'Internal configuration error'
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'inr',
            payment_method_types: ['card'],
        });

        console.log('Payment intent created:', paymentIntent.id);
        res.json({
            clientSecret: paymentIntent.client_secret,
            amount: amountInCents,
        });
    } catch (error) {
        console.error('Full error details:', error);
        
        if (error.type === 'StripeAuthenticationError') {
            return res.status(401).json({ 
                error: 'Payment service configuration error',
                details: 'Invalid API key'
            });
        }
        
        if (error.type === 'StripeInvalidRequestError') {
            return res.status(400).json({ 
                error: 'Invalid request to payment service',
                details: error.message
            });
        }
        
        res.status(500).json({ 
            error: 'Failed to create payment intent',
            details: error.message || 'Unknown error occurred'
        });
    }
});

// Webhook to handle successful payments
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            console.log('Payment succeeded:', paymentIntent.id);
        }

        res.json({ received: true });
    } catch (err) {
        console.error('Webhook Error:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

// Start server
app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log('Server configuration loaded');
}); 