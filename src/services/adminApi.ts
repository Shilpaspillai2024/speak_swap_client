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