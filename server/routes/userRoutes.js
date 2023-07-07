const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');


router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: 'Logged in successfully', user: req.user });
});
  
router.post('/signup', async (req, res) => {
try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
    res.status(400).json({ message: 'Email is already in use' });
    return;
    }

    const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    });

    await user.save();
    res.json({ message: 'User registered successfully' });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
}
});


router.get('/api/get-tokens-info', async (req, res) => {
try {
    const { email } = req.query;

    const user = await User.findOne({ email: email });

    if (user) {
    const tokensUsed = user.tokensUsed || 0; 
    const chargeDue = tokensUsed * 0.00025;
    const maxTokens = user.maxTokens;

    res.json({ success: true, tokensUsed, chargeDue, maxTokens }); 
    } else {
    res.json({ success: false });
    }
} catch (error) {
    console.error('Error fetching tokens info:', error);
    res.status(500).json({ success: false });
}
});

router.post('/api/set-max-tokens', async (req, res) => {
    try {
        const { email, maxTokens } = req.body;

        // Find the user and update their maximum tokens
        const user = await User.findOne({ email: email });
        user.maxTokens = maxTokens;
        await user.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Error setting max tokens:', error);
        res.status(500).json({ success: false });
    }
});

router.get('/api/get-user-details', async (req, res) => {
try {
    const email = req.query.email;
    if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required.' });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
    return res.status(404).json({ success: false, error: 'User not found.' });
    }

    res.status(200).json({ success: true, userDetails: user });
} catch (error) {
    console.error(`Error getting user details: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
}
});

router.put('/api/update-user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { showTokenModal } = req.body;
        const user = await User.findByIdAndUpdate(
            userId,
            { showTokenModal },
            { new: true }
        );
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
});

router.put('/api/saveSummaryPrompt/:userId', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      
      // Check if savedSummaryPrompt is undefined and initialize it as an empty array
      if (!user.savedSummaryPrompt) {
        user.savedSummaryPrompt = [];
      }
      
      user.savedSummaryPrompt.push(req.body);
      await user.save();
  
      // Return the updated user data
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ error });
    }
  });

router.put('/api/saveBlogPostPrompt/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        // Check if savedBlogPostPrompt is undefined and initialize it as an empty array
        if (!user.savedBlogPostPrompt) {
        user.savedBlogPostPrompt = [];
        }

        user.savedBlogPostPrompt.push(req.body);
        await user.save();

        // Return the updated user data
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = router;