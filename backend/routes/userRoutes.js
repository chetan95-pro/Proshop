import express from 'express';
import { authUser, getUserProfile, registerUser, updateUserProfile } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

//@description: Authenticate the user & get token
//@route: POST /api/user/login
//@access: Public
router.post('/login', authUser);

//@description: Register a new user
//@route: POST /api/users
//@access: Public
router.route('/').post(registerUser);

//@description: Get user profile
//@route: GET /api/users/profile
//@access: Private
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);



export default router;