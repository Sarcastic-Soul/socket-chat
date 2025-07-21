import express from 'express';
import { getMediaCloudinarySignature, getProfilePicSignature } from '../controllers/cloudinary.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/signature', protectRoute, getMediaCloudinarySignature);
router.get('/signature/profile-pic', protectRoute, getProfilePicSignature);

export default router;
