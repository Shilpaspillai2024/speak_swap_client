'use client'
import React, { useEffect, useState } from 'react';
import { Globe, Languages, Clock, Search } from 'lucide-react';
import { listTutorsForUser } from '@/services/userApi';
import { ITutor } from '@/types/tutor';
import UserNavbar from '@/components/UserNavbar';
import { useRouter } from 'next/navigation';
import UserProtectedRoute from '@/HOC/UserProtectedRoute';
import Image from 'next/image';
import { debounce } from 'lodash';
import Pagination from '@/components/Pagination';
import { TutorResponse } from '@/types/tutor';

const TutorsPage = () => {
  const [tutors, setTutors] = React.useState<ITutor[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');




  const[currentPage,setCurrentPage]=useState(1);
  const [totalPages,setTotalPages]=useState(1);
  const [totalItems,setTotalItems]=useState(0);
  const itemsPerPage=6;
  const router=useRouter();



  const debouncedSearch=React.useCallback(
    debounce((query:string)=>{
      setCurrentPage(1);
      fetchTutors(query);
    },500),
    []
  );

  const handleSearchChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
   const query=e.target.value;
   setSearchQuery(query);
   debouncedSearch(query);
  }
    const fetchTutors = async (query:string='',page:number=currentPage) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await listTutorsForUser(query,page,itemsPerPage) as TutorResponse;
        setTutors(response.tutors);
        setTotalItems(response.meta.totalItems);
        setTotalPages(response.meta.totalPages);
        setCurrentPage(response.meta.currentPage);
      } catch (error) {
        setError(typeof error === 'string' ? error : 'Failed to fetch tutors');
        console.error('Error fetching tutors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(()=>{
      fetchTutors(searchQuery,currentPage);

    },[currentPage]);

  
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

  const viewProfile=(tutorId:string)=>{
    router.push(`/dashboard/tutor/${tutorId}`);
  }

  if (isLoading) {
    return (
      <>
        <UserNavbar />
        <div className="flex items-center justify-center min-h-screen bg-purple-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <UserNavbar />
        <div className="flex items-center justify-center min-h-screen bg-purple-50">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg shadow-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50">
      <UserNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            Find Your Perfect Language Tutor
          </h1>
          <p className="text-black max-w-2xl mx-auto">
            Connect with experienced language tutors from around the world and start your learning journey today.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name, Teachinglanguage, or country..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-purple-200 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {tutors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-purple-500 text-lg">No tutors found matching your search.</p>
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutors.map((tutor) => (
              <div 
                key={tutor._id} 
                className="bg-gradient-to-br from-indigo-200 to-purple-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                <div className="p-6 flex items-center space-x-4 border-b border-purple-100">
                  <div className="relative h-16 w-16 rounded-full bg-purple-200 overflow-hidden shadow-md">
                    {tutor.profilePhoto ? (
                      <Image 
                        src={tutor.profilePhoto} 
                        alt={tutor.name}
                        width={64}
                        height={64}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-500 text-white text-xl font-semibold">
                        {tutor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${
                      tutor.isActive ? 'bg-green-400' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-black">{tutor.name}</h2>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      tutor.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tutor.isActive ? '● Active' : 'InActive'}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Languages className="h-5 w-5 text-black" />
                    <span className="font-medium text-black">Teaches: {tutor.teachLanguage}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-black" />
                    <span className="text-black">Country: {tutor.country}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-black" />
                    <span className="text-black">Timezone: {tutor.timeZone}</span>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-sm text-black mb-2 font-medium">Also speaks:</p>
                    <div className="flex flex-wrap gap-2">
                      {tutor.knownLanguages?.map((lang) => (
                        <span 
                          key={lang}
                          className="px-3 py-1 bg-purple-100 text-indigo-600 rounded-full text-xs font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  onClick={()=>viewProfile(tutor._id)}>
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          </>

        )}
      </div>
    </div>
  );
};

export default UserProtectedRoute(TutorsPage);