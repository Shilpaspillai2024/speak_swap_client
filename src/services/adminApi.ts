import axiosInstance from "./axiosInstance";




export const loginAdmin=async(email:string,password:string)=>{
    try {

        const response =await axiosInstance.post(`/admin`,{email,password},{
            headers:{
                'Content-Type':'application/json'
            }
           
        });

        return response.data
        
    } catch (error) {
        console.error("Error in logging in admin:", error);    
}
};


export const refreshToken=async()=>{
  try {

    const response=await axiosInstance.post(`/admin/refresh-token`)
    return response.data
    
  } catch (error) {
    console.error("Errror refreshing token:",error);
    return null
    
  }


};


export const getAllUser=async()=>{
  try {
    const response=await axiosInstance.get(`/admin/users`)

   return response.data.users || []
    
  } catch (error) {
    console.error("Error fetching users:",error)
    throw error;
    
  }
}


export const blockUnblockUser=async(userId:string,isActive:boolean)=>{
  try {
    const response=await axiosInstance.patch(`/admin/users/${userId}`,{isActive})
    return response.data
    
  } catch (error) {
    console.error("Error in block/unblock user:", error);
    throw error; 
  }
}


export const getTutors=async()=>{
  try {
    const response=await axiosInstance.get('/admin/tutors/alltutors')
    console.log('api response:',response.data)
    
    return response.data.tutor || []
    
  } catch (error) {
    console.error("error in fetching tutors:",error);
    throw error;
  }
}


export const getPendingTutors=async()=>{
  try {
    const response=await axiosInstance.get('/admin/tutors/pending-tutors')
    return response.data.tutors || []
    
  } catch (error) {
    console.error("error in fetching tutors:",error);
    throw error;
  }
}

export const tutorVerify=async(tutorId: string, action: 'approved' | 'rejected')=>{


  try {

    const response=await axiosInstance.patch(`/admin/tutors/verify/${tutorId}/status`,{
      status:action,

    })
    console.log(response.data.message);
   return response.data
    
  } catch (error) {
    console.error("Error updating tutor status:", error);
  }
}


export const blockUnblockTutor=async(tutorId:string,isActive:boolean)=>{
  try {
    const response=await axiosInstance.patch(`/admin/tutors/${tutorId}`,{isActive})
    return response.data
    
  } catch (error) {
    console.error("Error in block/unblock tutor:", error);
    throw error; 
  }
}
