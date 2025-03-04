export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type Category = 
  | 'food' 
  | 'transportation' 
  | 'entertainment' 
  | 'shopping' 
  | 'utilities' 
  | 'rent' 
  | 'other';

export type Expense = {
  id: string;
  groupId: string;
  title: string;
  amount: number;
  paidBy: string;
  date: string;
  category: Category;
  participants: {
    userId: string;
    amount: number;
  }[];
  notes?: string;
  receipt?: string;
};

export type Group = {
  id: string;
  name: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
  avatar?: string;
};

export type Settlement = {
  id: string;
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed';
};

export type CategoryReport = {
  category: Category;
  amount: number;
  percentage: number;
};

export type UserBalance = {
  userId: string;
  balance: number;
};

export type AppSettings = {
  currency: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
  isPremium: boolean;
  dailyExpenseCount: number;
  lastExpenseDate: string | null;
};