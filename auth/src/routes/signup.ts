import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@provins/common';

import { User } from '../models/user';

const router = express.Router();

// This route handles the sign-up process. When a POST request is
// made to '/api/users/signup', it validates the request body using
// express-validator
router.post(
  '/api/users/signup', [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ], validateRequest, async (req: Request, res: Response) => {
    // Extract email and password from the request body
    const { email, password } = req.body;
    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email is already in use');
    }

    // Create a new user instance and save it to the database
    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    }, process.env.JWT_KEY!);

    // Store JWT on session object
    req.session = {
      jwt: userJwt
    };

    // Send the created user as a response
    // The response includes the user object, which contains the user's
    // id and email. The password is not included in the response
    res.status(201).send(user);
  }
);

export { router as signUpRouter };
