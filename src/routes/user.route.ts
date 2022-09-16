import { Router } from 'express';
import userController from '../controllers/user.controller';
import { auth } from '../middleware/auth.middleware';
import {
    signupValidation,
    loginValidation
} from '../validation/user.validation';

export const userRouter = Router();

userRouter.post('/signup', signupValidation, userController.registration);
userRouter.post('/login', loginValidation, userController.login);
userRouter.get('/searchClient', auth, userController.searchClient);

// export default userRouter;
