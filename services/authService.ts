import type { User } from '../types';

const USERS_KEY = 'legal_ai_users';
const LOCAL_SESSION_KEY = 'legal_ai_session_local';
const TEMP_SESSION_KEY = 'legal_ai_session_temp';

// Mock user database in localStorage
const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const updateUser = (updatedUser: User): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === updatedUser.email);
        if (userIndex === -1) {
          return reject(new Error('User not found.'));
        }
        const currentUser = users[userIndex];
        users[userIndex] = { ...currentUser, ...updatedUser };
        saveUsers(users);
        
        const localSession = localStorage.getItem(LOCAL_SESSION_KEY);
        if (localSession) {
            const sessionUser = JSON.parse(localSession);
            if (sessionUser.email === updatedUser.email) {
                localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(users[userIndex]));
            }
        }
        
        const tempSession = sessionStorage.getItem(TEMP_SESSION_KEY);
        if (tempSession) {
            const sessionUser = JSON.parse(tempSession);
            if (sessionUser.email === updatedUser.email) {
                sessionStorage.setItem(TEMP_SESSION_KEY, JSON.stringify(users[userIndex]));
            }
        }
    
        resolve(users[userIndex]);
    }, 200);
  });
};

export const register = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email || !password) {
        return reject(new Error('Email and password are required.'));
      }
      const users = getUsers();
      if (users.some(user => user.email === email)) {
        return reject(new Error('User with this email already exists.'));
      }
      const newUser: User = { email, apiKeys: {}, theme: 'dark' };
      saveUsers([...users, newUser]);
      // After registration, create a temporary session
      localStorage.removeItem(LOCAL_SESSION_KEY);
      sessionStorage.setItem(TEMP_SESSION_KEY, JSON.stringify(newUser));
      resolve(newUser);
    }, 500);
  });
};

export const login = (email: string, password: string, rememberMe: boolean): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        if (!email || !password) {
            return reject(new Error('Email and password are required.'));
        }
      const users = getUsers();
      const user = users.find(u => u.email === email);
      if (!user) {
        return reject(new Error('Invalid email or password.'));
      }
      
      // Clear previous sessions
      localStorage.removeItem(LOCAL_SESSION_KEY);
      sessionStorage.removeItem(TEMP_SESSION_KEY);

      // Mock password check - in a real app, this would be a secure check
      if (rememberMe) {
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
      } else {
          sessionStorage.setItem(TEMP_SESSION_KEY, JSON.stringify(user));
      }
      resolve(user);
    }, 500);
  });
};

export const logout = (): Promise<void> => {
    return new Promise((resolve) => {
        localStorage.removeItem(LOCAL_SESSION_KEY);
        sessionStorage.removeItem(TEMP_SESSION_KEY);
        resolve();
    });
};

export const getCurrentUser = (): User | null => {
  const localSession = localStorage.getItem(LOCAL_SESSION_KEY);
  if (localSession) {
    return JSON.parse(localSession);
  }
  
  const tempSession = sessionStorage.getItem(TEMP_SESSION_KEY);
  return tempSession ? JSON.parse(tempSession) : null;
};