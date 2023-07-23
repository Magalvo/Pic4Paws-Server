import express from 'express';
import Message from '../models/Message.model.js';
const router = express.Router();

//Add

router.post('/', async (req, res) => {
  const { message } = req.body;

  const newMessage = new Message({
    sender: message.sender,
    text: message.text,
    conversationId: message.conversationId
  });

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    console.log('Error Saving Message:', error);
  }
});

//get

router.get('/:conversationId', async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log('Error getting Messages:', error);
  }
});

export default router;
