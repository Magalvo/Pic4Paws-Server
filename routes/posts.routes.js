import express from 'express';
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  UploadImg
} from '../controllers/posts.js';
//import { verifyToken } from '../middleware/auth.js';
import { isAuthenticated } from '../middleware//firebase.middleware.js';
import fileUploader from '../config/cloudinary.config.js';

const router = express.Router();

/* READ */
router.get('/', isAuthenticated, getFeedPosts);

router.get('/:userId/posts', isAuthenticated, getUserPosts);

/* UPLOAD */
router.post('/upload', fileUploader.single('file'), UploadImg);

/* UPDATE */
router.patch('/:id/like', isAuthenticated, likePost);

export default router;
