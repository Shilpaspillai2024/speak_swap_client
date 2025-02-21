'use client';

import React, { useEffect, useState } from 'react';
import { fetchUserWallet } from '@/services/userApi';
import UserNavbar from '@/components/UserNavbar';
import UserProtectedRoute from '@/HOC/UserProtectedRoute';
import { toast } from 'react-toastify';
import { ArrowUpCircle, ArrowDownCircle, RefreshCw } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  type: 'deposit' | 'withdraw' | 'refund';
  date: string;
  description: string; 
}

const WalletPage: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWalletDetails = async () => {
      try {
        const walletData = await fetchUserWallet();
        console.log("walletData", walletData);
        setBalance(walletData.data.balance || 0);
        setTransactions(walletData.data.transactions || []);
      } catch (error) {
        toast.error('Failed to fetch wallet details');
      } finally {
        setLoading(false);
      }
    };

    getWalletDetails();
  }, []);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpCircle className="w-6 h-6 text-green-500" />;
      case 'withdraw':
        return <ArrowDownCircle className="w-6 h-6 text-red-500" />;
      case 'refund':
        return <RefreshCw className="w-6 h-6 text-blue-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-600">Loading wallet details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
         
          <div className="bg-gradient-to-r bg-customBlue shadow-lg rounded-2xl p-8 mb-8 text-customTeal">
            <h1 className="text-3xl font-bold mb-2">My Wallet</h1>
            <div className="flex items-end">
              <span className="text-4xl font-bold">₹{balance.toLocaleString('en-IN')}</span>
              <span className="ml-2 mb-1">Available Balance</span>
            </div>
          </div>

       
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">Transaction History</h2>
            
            {transactions?.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((txn, index) => (
                  <div key={index} className="flex items-center p-4 border rounded-lg hover:shadow-md transition-shadow duration-200 bg-gray-50">
                    <div className="mr-4">
                      {getTransactionIcon(txn.type)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800 capitalize">{txn.type}</p>
                          <p className="text-sm text-gray-600 mt-1">{txn.description || 'No description'}</p>
                          <p className="text-sm text-gray-500 mt-1">{formatDate(txn.date)}</p>
                        </div>
                        <p className={`font-bold ${
                          txn.type === 'deposit' ? 'text-green-600' : 
                          txn.type === 'withdraw' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {txn.type === 'deposit' ? '+' : txn.type === 'withdraw' ? '-' : ''}₹{txn.amount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-2">No transactions found</p>
                <p className="text-sm text-gray-400">Your transaction history will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProtectedRoute(WalletPage);
