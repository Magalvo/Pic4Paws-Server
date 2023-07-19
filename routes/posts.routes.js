import express from 'express';
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost
} from '../controllers/posts.js';
//import { verifyToken } from '../middleware/auth.js';
import { isAuthenticated } from '../middleware//firebase.middleware.js';
import fileUploader from '../config/cloudinary.config.js';
import { UploadPic } from '../controllers/auth.js';

const router = express.Router();

/* READ */
/* {/posts/{...}} */
router.get('/', isAuthenticated, getFeedPosts);

router.get('/:id/', isAuthenticated, getUserPosts);

/* UPLOAD && CREATE POST */
router.post('/upload', fileUploader.single('file'), UploadPic);
router.post('/create', createPost);

/* UPDATE */
router.patch('/:id/like', isAuthenticated, likePost);

export default router;
