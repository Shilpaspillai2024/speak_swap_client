'use client';
import React, { useState, useEffect } from 'react';
import { getWalletDetails, withdrawFunds } from '@/services/tutorApi';
import TutorNavbar from '@/components/TutorNavbar';
import TutorSidebar from '@/components/TutorSidebar';
import tutorAuthStore from '@/store/tutorAuthStore';
import TutorProtectedRoute from '@/HOC/TutorProtectedRoute';
import { toast } from 'react-toastify';

interface Transaction {
  _id: string;
  description: string;
  date: string;
  creditedBy: string;
  type: 'credit' | 'debit';
  amount: number;
}

interface WalletDetails {
  balance: number;
  transactions: Transaction[];
}

const WalletPage: React.FC = () => {
  const [walletDetails, setWalletDetails] = useState<WalletDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isLoading } = tutorAuthStore();

  const fetchWalletDetails = async () => {
    try {
      setIsRefreshing(true);
      const response = await getWalletDetails();
      setWalletDetails(response.data as WalletDetails);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWalletDetails();
  }, []);

  const handleWithdrawClick = () => {
    if (!walletDetails || walletDetails.balance < 1) {
      toast.info("Insufficient balance");
      return;
    }
    setShowWithdrawModal(true);
  };

  const closeWithdrawModal = () => {
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid withdrawal amount");
      return;
    }

    if (!walletDetails || amount > walletDetails.balance) {
      toast.error("Withdrawal amount exceeds available balance");
      return;
    }

    try {
      await withdrawFunds(amount);
      toast.success("Withdrawal successful!");
      closeWithdrawModal();
      
      await fetchWalletDetails();
    } catch (error:unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
        console.error("Withdrawal error:", error); 
      }
    }
  };

  if (isLoading) return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TutorNavbar />
      <div className="flex flex-1">
        <TutorSidebar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TutorNavbar />
      <div className="flex flex-1">
        <TutorSidebar />
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded m-6 shadow-md">
          {error}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TutorNavbar />
      <div className="flex flex-1">
        <TutorSidebar />
        <div className="p-6 w-full">
          <div className="bg-white shadow-xl rounded-lg p-6 max-w-4xl mx-auto mt-6">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h1 className="text-3xl font-semibold text-gray-800">My Wallet</h1>
              <div className="text-right">
                <button
                  onClick={fetchWalletDetails}
                  disabled={isRefreshing}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-all"
                >
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  onClick={handleWithdrawClick}
                  className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700 transition-all"
                >
                  Withdraw
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-gray-600">Current Balance</span>
              <span className="text-4xl font-bold text-green-600">
              ₹{walletDetails?.balance?.toFixed(2) || '0.00'}
              </span>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Transaction History</h2>

              {isRefreshing && (
                <div className="flex justify-center my-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
                </div>
              )}

              {walletDetails?.transactions && walletDetails.transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Description</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Date</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">By</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {walletDetails.transactions.map((transaction: Transaction) => (
                        <tr key={transaction._id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm text-gray-700">{transaction.description}</td>
                          <td className="py-4 px-4 text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-500">{transaction.creditedBy}</td>
                          <td className={`py-4 px-4 text-sm font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-gray-500">No transactions</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Withdraw Funds</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="withdrawAmount">
                Amount to Withdraw
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-600">₹</span>
                <input
                  id="withdrawAmount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 pl-8 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="0.00"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Available Balance: ₹{walletDetails?.balance?.toFixed(2) || '0.00'}
              </p>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={closeWithdrawModal}
                className="px-4 py-2 text-gray-600 mr-2 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                className="px-4 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700 transition-all"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorProtectedRoute(WalletPage);