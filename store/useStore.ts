import { create } from 'zustand';
import { User, Expense, Group, Settlement, AppSettings, Category } from '@/types';
import { format } from 'date-fns';

interface AppState {
  currentUser: User | null;
  users: User[];
  expenses: Expense[];
  groups: Group[];
  settlements: Settlement[];
  settings: AppSettings;
  
  // User actions
  setCurrentUser: (user: User) => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, userData: Partial<User>) => void;
  
  // Expense actions
  addExpense: (expense: Expense) => boolean;
  updateExpense: (expenseId: string, expenseData: Partial<Expense>) => void;
  deleteExpense: (expenseId: string) => void;
  
  // Group actions
  addGroup: (group: Group) => void;
  updateGroup: (groupId: string, groupData: Partial<Group>) => void;
  deleteGroup: (groupId: string) => void;
  addUserToGroup: (groupId: string, userId: string) => void;
  removeUserFromGroup: (groupId: string, userId: string) => void;
  
  // Settlement actions
  addSettlement: (settlement: Settlement) => void;
  updateSettlement: (settlementId: string, settlementData: Partial<Settlement>) => void;
  
  // Settings actions
  updateSettings: (settingsData: Partial<AppSettings>) => void;
  
  // Utility functions
  canAddExpenseToday: () => boolean;
  resetDailyExpenseCount: () => void;
  getGroupExpenses: (groupId: string) => Expense[];
  getUserGroups: (userId: string) => Group[];
  getUserBalance: (userId: string) => number;
  getCategoryReport: (userId: string) => { category: Category; amount: number; percentage: number }[];
}

const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  users: [
    { id: '1', name: 'You', email: 'you@example.com' },
    { id: '2', name: 'Alex', email: 'alex@example.com' },
    { id: '3', name: 'Sam', email: 'sam@example.com' },
    { id: '4', name: 'Jordan', email: 'jordan@example.com' },
  ],
  expenses: [],
  groups: [
    { 
      id: '1', 
      name: 'Roommates', 
      members: ['1', '2', '3'], 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    },
    { 
      id: '2', 
      name: 'Trip to Barcelona', 
      members: ['1', '2', '3', '4'], 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    },
  ],
  settlements: [],
  settings: {
    currency: 'USD',
    theme: 'light',
    notifications: true,
    language: 'en',
    isPremium: false,
    dailyExpenseCount: 0,
    lastExpenseDate: null,
  },
  
  // User actions
  setCurrentUser: (user) => set({ currentUser: user }),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (userId, userData) => set((state) => ({
    users: state.users.map((user) => 
      user.id === userId ? { ...user, ...userData } : user
    ),
  })),
  
  // Expense actions
  addExpense: (expense) => {
    const state = get();
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Check if this is a new day
    if (state.settings.lastExpenseDate !== today) {
      set({ 
        settings: { 
          ...state.settings, 
          dailyExpenseCount: 1, 
          lastExpenseDate: today 
        },
        expenses: [...state.expenses, expense]
      });
      return true;
    }
    
    // Check if user can add more expenses today
    if (!state.settings.isPremium && state.settings.dailyExpenseCount >= 3) {
      return false;
    }
    
    // Add expense and increment counter
    set({ 
      expenses: [...state.expenses, expense],
      settings: { 
        ...state.settings, 
        dailyExpenseCount: state.settings.dailyExpenseCount + 1 
      }
    });
    return true;
  },
  updateExpense: (expenseId, expenseData) => set((state) => ({
    expenses: state.expenses.map((expense) => 
      expense.id === expenseId ? { ...expense, ...expenseData } : expense
    ),
  })),
  deleteExpense: (expenseId) => set((state) => ({
    expenses: state.expenses.filter((expense) => expense.id !== expenseId),
  })),
  
  // Group actions
  addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),
  updateGroup: (groupId, groupData) => set((state) => ({
    groups: state.groups.map((group) => 
      group.id === groupId ? { ...group, ...groupData, updatedAt: new Date().toISOString() } : group
    ),
  })),
  deleteGroup: (groupId) => set((state) => ({
    groups: state.groups.filter((group) => group.id !== groupId),
    expenses: state.expenses.filter((expense) => expense.groupId !== groupId),
    settlements: state.settlements.filter((settlement) => settlement.groupId !== groupId),
  })),
  addUserToGroup: (groupId, userId) => set((state) => ({
    groups: state.groups.map((group) => 
      group.id === groupId 
        ? { 
            ...group, 
            members: [...group.members, userId], 
            updatedAt: new Date().toISOString() 
          } 
        : group
    ),
  })),
  removeUserFromGroup: (groupId, userId) => set((state) => ({
    groups: state.groups.map((group) => 
      group.id === groupId 
        ? { 
            ...group, 
            members: group.members.filter((id) => id !== userId), 
            updatedAt: new Date().toISOString() 
          } 
        : group
    ),
  })),
  
  // Settlement actions
  addSettlement: (settlement) => set((state) => ({ 
    settlements: [...state.settlements, settlement] 
  })),
  updateSettlement: (settlementId, settlementData) => set((state) => ({
    settlements: state.settlements.map((settlement) => 
      settlement.id === settlementId ? { ...settlement, ...settlementData } : settlement
    ),
  })),
  
  // Settings actions
  updateSettings: (settingsData) => set((state) => ({
    settings: { ...state.settings, ...settingsData },
  })),
  
  // Utility functions
  canAddExpenseToday: () => {
    const state = get();
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // If it's a new day or user is premium, they can add expenses
    if (state.settings.lastExpenseDate !== today || state.settings.isPremium) {
      return true;
    }
    
    // Check if user has reached the daily limit
    return state.settings.dailyExpenseCount < 3;
  },
  resetDailyExpenseCount: () => set((state) => ({
    settings: { 
      ...state.settings, 
      dailyExpenseCount: 0, 
      lastExpenseDate: format(new Date(), 'yyyy-MM-dd') 
    },
  })),
  getGroupExpenses: (groupId) => {
    return get().expenses.filter((expense) => expense.groupId === groupId);
  },
  getUserGroups: (userId) => {
    return get().groups.filter((group) => group.members.includes(userId));
  },
  getUserBalance: (userId) => {
    const { expenses, settlements } = get();
    let balance = 0;
    
    // Calculate what user paid
    expenses.forEach((expense) => {
      if (expense.paidBy === userId) {
        // Add what others owe this user
        expense.participants.forEach((participant) => {
          if (participant.userId !== userId) {
            balance += participant.amount;
          }
        });
      } else {
        // Subtract what this user owes others
        expense.participants.forEach((participant) => {
          if (participant.userId === userId) {
            balance -= participant.amount;
          }
        });
      }
    });
    
    // Adjust for settlements
    settlements.forEach((settlement) => {
      if (settlement.status === 'completed') {
        if (settlement.fromUserId === userId) {
          balance -= settlement.amount;
        } else if (settlement.toUserId === userId) {
          balance += settlement.amount;
        }
      }
    });
    
    return balance;
  },
  getCategoryReport: (userId) => {
    const { expenses } = get();
    const userExpenses = expenses.filter((expense) => 
      expense.paidBy === userId || 
      expense.participants.some((p) => p.userId === userId)
    );
    
    // Calculate total amount by category
    const categoryTotals: Record<Category, number> = {
      food: 0,
      transportation: 0,
      entertainment: 0,
      shopping: 0,
      utilities: 0,
      rent: 0,
      other: 0,
    };
    
    userExpenses.forEach((expense) => {
      if (expense.paidBy === userId) {
        // Only count the user's share
        const userShare = expense.participants.find((p) => p.userId === userId)?.amount || 0;
        categoryTotals[expense.category] += (expense.amount - userShare);
      } else {
        // Count what the user owes
        const userShare = expense.participants.find((p) => p.userId === userId)?.amount || 0;
        categoryTotals[expense.category] += userShare;
      }
    });
    
    // Calculate total amount
    const totalAmount = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    
    // Create report
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category: category as Category,
        amount,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  },
}));

export default useStore;