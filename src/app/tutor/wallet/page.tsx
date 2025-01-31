'use client';
import React, { useState, useEffect } from 'react';
import { getWalletDetails } from '@/services/tutorApi';
import TutorNavbar from '@/components/TutorNavbar';
import TutorSidebar from '@/components/TutorSidebar';
import tutorAuthStore from '@/store/tutorAuthStore';
import TutorProtectedRoute from '@/HOC/TutorProtectedRoute';
const WalletPage: React.FC = () => {
  const [walletDetails, setWalletDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { isLoading } = tutorAuthStore();  // Using isLoading from tutorAuthStore

  useEffect(() => {
    const fetchWalletDetails = async () => {
      try {
        const response = await getWalletDetails();
        setWalletDetails(response.data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchWalletDetails();
  }, []);

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
                <button className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700 transition-all">
                  Withdraw
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-gray-600">Current Balance</span>
              <span className="text-4xl font-bold text-green-600">
                ${walletDetails?.balance.toFixed(2)}
              </span>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Transaction History</h2>

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
                      {walletDetails.transactions.map((transaction: any) => (
                        <tr key={transaction._id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm text-gray-700">{transaction.description}</td>
                          <td className="py-4 px-4 text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-500">{transaction.creditedBy}</td>
                          <td className={`py-4 px-4 text-sm font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
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
    </div>
  );
};

export default TutorProtectedRoute(WalletPage);