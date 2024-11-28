import axios from 'axios'

const BACKEND_URL=process.env.NEXT_PUBLIC_BACKEND_URL

//post admin login

export const loginAdmin=async(email:string,password:string)=>{
    try {

        const response =await axios.post(`${BACKEND_URL}/admin`,{email,password},{
            headers:{
                'Content-Type':'application/json'
            },
            withCredentials:true,
        });

        return response.data
        
    } catch (error) {

        
        
    }
}