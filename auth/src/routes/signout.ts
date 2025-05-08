import express from 'express';

const router = express.Router();

// This route handles the sign-out process. When a POST request is 
// made to '/api/users/signout', it clears the session by setting
// req.session to null
// This effectively logs the user out by destroying their session
router.post('/api/users/signout', (req, res) => {
  req.session = null;

  res.send({});
});

export { router as signOutRouter };
