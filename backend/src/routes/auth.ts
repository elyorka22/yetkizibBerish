import express, { Router, Request, Response } from 'express';
import { auth } from '../config/firebase';

export const authRouter = Router();

authRouter.post('/verify', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const decodedToken = await auth.verifyIdToken(token);
    
    res.json({
      valid: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
    });
  } catch (error: any) {
    res.status(401).json({
      valid: false,
      message: error.message,
    });
  }
});

