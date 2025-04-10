import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

type SignupParams = Record<string, never>;
type SignupResponse = {
  success: boolean;
  message: string;
  token?: string;
  error?: string;
};
type SignupBody = {
  name: string;
  email: string;
  password: string;
};
type SignupQuery = Record<string, never>;

const signup: RequestHandler<SignupParams, SignupResponse, SignupBody, SignupQuery> = async (
  req,
  res,
) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User already exists',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
    return;
  }
};

type LoginParams = Record<string, never>;
type LoginResponse = {
  success?: boolean;
  message: string;
  response?: string;
  error?: string;
};
type LoginBody = {
  email: string;
  password: string;
};
type LoginQuery = Record<string, never>;

const login: RequestHandler<LoginParams, LoginResponse, LoginBody, LoginQuery> = async (
  req,
  res,
) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Verify password tHE hASHED password 
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Password is incorrect',
      });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ message: 'Login successful', response: token });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
    return;
  }
};

export { login, signup };
