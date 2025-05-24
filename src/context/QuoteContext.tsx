
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface QuoteItem {
  id: string; // Unique ID: typically productId + selected options
  productId: string;
  name: string;
  quantity: number;
  pricePerUnit: number; // Price for ONE item with selected options
  imageUrl?: string;
  dataAiHint?: string;
  selectedMedidaLabel?: string;
  selectedAcabadoLabel?: string;
}

interface QuoteContextType {
  quoteItems: QuoteItem[];
  addToQuote: (item: Omit<QuoteItem, 'quantity'>, quantity?: number) => void;
  removeFromQuote: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearQuote: () => void;
  totalItems: number;
  totalPrice: number;
  getItemById: (itemId: string) => QuoteItem | undefined;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedQuote = localStorage.getItem('madeTimberQuote');
      if (storedQuote) {
        try {
          setQuoteItems(JSON.parse(storedQuote));
        } catch (error) {
          console.error("Error parsing quote from localStorage:", error);
          localStorage.removeItem('madeTimberQuote'); // Clear corrupted data
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('madeTimberQuote', JSON.stringify(quoteItems));
    }
  }, [quoteItems]);

  const addToQuote = useCallback((itemDetails: Omit<QuoteItem, 'quantity'>, quantityToAdd: number = 1) => {
    setQuoteItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === itemDetails.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === itemDetails.id ? { ...i, quantity: i.quantity + quantityToAdd } : i
        );
      }
      return [...prevItems, { ...itemDetails, quantity: quantityToAdd }];
    });
  }, []);

  const removeFromQuote = useCallback((itemId: string) => {
    setQuoteItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  const updateItemQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromQuote(itemId);
    } else {
      setQuoteItems(prevItems =>
        prevItems.map(item => (item.id === itemId ? { ...item, quantity } : item))
      );
    }
  }, [removeFromQuote]);

  const clearQuote = useCallback(() => {
    setQuoteItems([]);
  }, []);
  
  const getItemById = useCallback((itemId: string) => {
    return quoteItems.find(item => item.id === itemId);
  }, [quoteItems]);

  const totalItems = quoteItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = quoteItems.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);

  return (
    <QuoteContext.Provider
      value={{
        quoteItems,
        addToQuote,
        removeFromQuote,
        updateItemQuantity,
        clearQuote,
        totalItems,
        totalPrice,
        getItemById,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = (): QuoteContextType => {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
};
