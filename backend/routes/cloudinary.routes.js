import express from 'express';
import { getCloudinarySignature } from '../controllers/cloudinary.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/signature', protectRoute, getCloudinarySignature);

export default router;
