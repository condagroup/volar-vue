const express = require('express');
const router = express.Router();
const Conversation = require('../models/conversation');
const User = require('../models/user');

router.post('/api/saveConversation', async (req, res) => {
    try {
        const userId = req.body.userId;
        const chatHistory = req.body.chatHistory;
    
        const conversation = new Conversation({
        userId,
        chatHistory: chatHistory.map((message) => ({
            ...message,
            time: message.time,
        })),
        });
    
        await conversation.save();
        res.json({ message: 'Conversation history saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
        }
    });
    
    router.put('/api/updateConversation/:conversationId', async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const chatHistory = req.body.chatHistory;
    
        console.log('Running updateConversation. Result:');
    
        const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        { chatHistory: chatHistory },
        { new: true }
        );
    
        console.log(updatedConversation);
        if (updatedConversation) {
        res.status(200).json({ message: 'Conversation updated successfully', conversation: updatedConversation });
        } else {
        res.status(404).json({ message: 'Conversation not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
    });
    
    router.get('/api/getConversations/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const conversations = await Conversation.find({ userId });
    
        const chatHistory = conversations.reduce((acc, conversation) => {
        const firstUserMessage = conversation.chatHistory[0];
        const lastMessage = conversation.chatHistory.slice(-1)[0];
        if (lastMessage) {
            acc.push({
            conversationId: conversation._id,
            timestamp: lastMessage.time,
            firstUserMessage: firstUserMessage
            });
        }
        return acc;
        }, []);
    
        res.json({ chatHistory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
    });
    
    router.post('/api/startNewConversation', async (req, res) => {
    try {
        const userId = req.body.userId;
    
        const conversation = new Conversation({
        userId,
        chatHistory: [],
        });
    
        await conversation.save();
        res.json({ message: `New conversation started with id ${conversation._id}`, conversationId: conversation._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
    });
    
    router.get('/api/getConversation/:conversationId', async (req, res) => {
        try {
          const conversationId = req.params.conversationId;
          const conversation = await Conversation.findById(conversationId);
      
          res.json({ conversation });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        }
    });
    
    router.delete('/api/deleteConversation/:conversationId', async (req, res) => {
        try {
          const conversationId = req.params.conversationId;
          await Conversation.findByIdAndDelete(conversationId);
          res.json({ message: `Conversation with id ${conversationId} deleted` });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        }
      });
    
module.exports = router;