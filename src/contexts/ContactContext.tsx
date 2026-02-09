import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContactMessage } from '../types';

interface ContactContextType {
  messages: ContactMessage[];
  addMessage: (message: Omit<ContactMessage, 'id' | 'timestamp' | 'status'>) => void;
  updateMessageStatus: (id: string, status: ContactMessage['status']) => void;
  deleteMessage: (id: string) => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
};

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('contactMessages');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('contactMessages', JSON.stringify(messages));
  }, [messages]);

  const addMessage = (messageData: Omit<ContactMessage, 'id' | 'timestamp' | 'status'>) => {
    const newMessage: ContactMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const updateMessageStatus = (id: string, status: ContactMessage['status']) => {
    setMessages(prev => prev.map(message => 
      message.id === id ? { ...message, status } : message
    ));
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(message => message.id !== id));
  };

  return (
    <ContactContext.Provider value={{ messages, addMessage, updateMessageStatus, deleteMessage }}>
      {children}
    </ContactContext.Provider>
  );
};