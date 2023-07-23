import express from 'express';
import Conversation from '../models/Conversation.model.js';
const router = express.Router();

//new conv

router.post('/', async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId]
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (error) {
    console.log('Error Sending message:', error);
  }
});

//get user conversations list by id

router.get('/:userId', async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] }
    });
    res.status(200).json(conversation);
  } catch (error) {
    console.log('Error Fetching messages:', error);
  }
});

//get conversation includes two userID

router.get('/find/:firstUserId/:secondUserId', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] }
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
    console.log('Error fetching messages:', err);
  }
});

export default router;
