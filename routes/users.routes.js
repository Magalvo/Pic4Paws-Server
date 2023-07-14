import express from 'express';

import {
  getUser,
  getUserFriends,
  addRemoveFriend
} from '../controllers/users.js';

import { verifyToken } from '../middleware/auth.js';
import { isAuthenticated } from '../middleware/firebase.middleware.js';

const router = express.Router();

/* Read */

router.get('/:id', isAuthenticated, getUser);
router.get('/:id/friends', isAuthenticated, getUserFriends);

/* Update */
router.patch('/:id/:friendId', isAuthenticated, addRemoveFriend);

export default router;
