import express from 'express';
import { currentUser } from '@provins/common';

// This route is used to get the current user information
const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  // It uses the currentUser middleware to check if the user is authenticated
  // and then sends information of the current user back in the response
  // If the user is not authenticated, it sends null as the currentUser in the response
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
