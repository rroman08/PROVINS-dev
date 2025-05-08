import express from 'express';
import { currentUser } from '@provins/common';

const router = express.Router();

// This route is used to get the current user information
router.get('/api/users/currentuser', currentUser, (req, res) => {
  // It uses the currentUser middleware to check if the user is authenticated
  // and then sends information about current user back in the response
  // If the user is not authenticated, it responds with null as instead of the currentUser
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
