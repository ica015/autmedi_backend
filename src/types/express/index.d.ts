import { Request } from 'express';

export interface AuthenticatedUser {
  user_id: number;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}