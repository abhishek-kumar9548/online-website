import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserAddress } from '../types.ts';
import { api, getAuthToken, removeAuthToken } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register' | 'forgot';
  openAuthModal: (tab?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, phone?: string) => Promise<void>;
  addAddress: (address: Omit<UserAddress, 'id'>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  loginAsDemoCustomer: () => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      api.getMe()
        .then(res => setUser(res.user))
        .catch(() => {
          removeAuthToken();
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = (tab: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setUser(res.user);
    setIsAuthModalOpen(false);
  };

  const register = async (name: string, email: string, pass: string, phone?: string) => {
    const res = await api.register(name, email, pass, phone);
    setUser(res.user);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  const updateProfile = async (name: string, phone?: string) => {
    const res = await api.updateProfile(name, phone);
    setUser(res.user);
  };

  const addAddress = async (addrData: Omit<UserAddress, 'id'>) => {
    const res = await api.addAddress(addrData);
    setUser(res.user);
  };

  const deleteAddress = async (addressId: string) => {
    const res = await api.deleteAddress(addressId);
    setUser(res.user);
  };

  const loginAsDemoCustomer = async () => {
    await login('customer@utsavveda.com', 'Customer@12345');
  };

  const loginAsDemoAdmin = async () => {
    await login('admin@utsavveda.com', 'Admin@12345');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        loginAsDemoCustomer,
        loginAsDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
