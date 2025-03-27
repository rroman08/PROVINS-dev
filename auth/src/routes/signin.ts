import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@provins/common';

import { Password } from '../services/password';
import { User } from '../models/user';

const router = express.Router();

// This route is used to sign in a user
// It uses express-validator to validate the request body
// It checks if the email is valid and if the password is not empty
// If the validation fails, it sends a 400 Bad Request response
router.post('/api/users/signin', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
  ], validateRequest, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // It checks if the user exists in the database
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    // It checks if the password is correct
    // It uses the Password service to compare the hashed password in the database
    // with the password provided in the request
    const passwordsMatch = await Password.compare(existingUser.password, password);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    } 

    // Generate JWT
    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_KEY!);

    // Store JWT on session object
    req.session = {
      jwt: userJwt
    };

    res.status(200).send(existingUser);
  }
);

export { router as signInRouter };
