import express from 'express';
import { google, login, UploadPic, register } from '../controllers/auth.js';
import fileUploader from '../config/cloudinary.config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import auth from '../config/firebase.config.js';
const saltRounds = 10;
const Rande = Math.floor(Math.random() * 1000);
const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.post('/signup-google', google);

router.post('/upload', fileUploader.single('file'), UploadPic);

export default router;
