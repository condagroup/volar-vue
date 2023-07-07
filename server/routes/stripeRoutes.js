
const express = require('express');
const router = express.Router();
// const stripe = require('stripe')('sk_test_cwLTxAia7irYupsgmAYzQv7X');      // Testing key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);              // Live key
const User = require('../models/user');

router.post('/api/create-customer-and-subscription', async (req, res) => {
    try {
        const { email, token } = req.body;
    
        // Create a new customer
        const customer = await stripe.customers.create({
        email: email,
        source: token,
        });
    
        // Create a subscription for the customer
        const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        // items: [{ plan: 'price_1Mt6BFDZxZLcMvYX82uvS13U' }],      // Test ID
        items: [{ plan: 'price_1N567BDZxZLcMvYXSPrlACGA' }],   // Live ID
        });
    
        const subscriptionItemId = subscription.items.data[0].id;
        const customerId = customer.id
    
        // Check if the subscription was successful
        if (subscription.status === 'active') {
        res.json({ success: true, subscriptionItemId, customerId});
        } else {
        res.json({ success: false });
        }
    
        // Find the user by email and update the subscription item ID
        const user = await User.findOne({ email: email });
        if (!user) {
        throw new Error('User not found');
        }
    
        user.customerId = customerId;
        user.subscriptionItemId = subscriptionItemId;
        user.isSubscribed = true;
        user.maxTokens = Number.POSITIVE_INFINITY;
        user.tokensUsed = 0;
        await user.save();
    
        console.log(`Subscription created: ${subscription.id}, Subscription Item ID saved: ${subscriptionItemId}`);
    
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ success: false });
    }
    });
    
    router.post('/api/update-tokens-used', async (req, res) => {
    try {
        const { email, tokensUsed } = req.body;
    
        // Find the user and update their tokens used
        const user = await User.findOne({ email: email });
        if (!user.tokensUsed) {
        user.tokensUsed = tokensUsed;
        } else {
        user.tokensUsed += tokensUsed;
        }
        await user.save();
    
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating tokens used:', error);
        res.status(500).json({ success: false });
    }
    });
    
    router.post('/api/report-usage', async (req, res) => {
    try {
        const { customerId, subscriptionItemId, tokensUsed } = req.body;
    
        // Retrieve the subscription item
        const subscriptionItem = await stripe.subscriptionItems.retrieve(subscriptionItemId);
    
        // Check if the customer and subscription item are valid and match
        if (!subscriptionItem || subscriptionItem.id !== subscriptionItemId) {
        throw new Error('Invalid customer or subscription item');
        }
    
        if (subscriptionItem.plan.active !== true) {
        throw new Error('Subscription plan is not active');
        }
    
        // Retrieve the subscriptions for the customer
        const subscriptionsResponse = await stripe.subscriptions.list({
            customer: customerId,
        });
        
        // Get the subscriptions data array
        const subscriptions = subscriptionsResponse.data;
        
        // Find the subscription associated with the subscription item
        const associatedSubscription = subscriptions.find(sub => {
            return sub.items.data.some(item => item.id === subscriptionItem.id);
        });
        
        // Check if the associated subscription exists and has an active status
        if (!associatedSubscription || associatedSubscription.status !== 'active') {
            throw new Error('Invalid or inactive subscription');
        }
    
        // Report usage to Stripe
        const usageRecord = await stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
            quantity: tokensUsed,
            timestamp: Math.floor(Date.now() / 1000), // Convert to Unix timestamp
            action: 'increment', // Add the usage to the current usage
          });
    
        res.status(200).json({ success: true, usageRecord });
        } catch (error) {
            console.error(`Error reporting usage: ${error.message}`);
            res.status(500).json({ success: false, error: error.message });
    }
    });
    
    module.exports = router;