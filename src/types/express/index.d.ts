import { Request } from 'express';

export interface AuthenticatedUser {
  user_id: number;
  email: string;
  rule: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}