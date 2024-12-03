import axios from 'axios'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL


//fetch the countries
export const fetchCountries=async ():Promise<any>=>{
    try {

        const response= await axios.get(`${BACKEND_URL}/countries`,{
            headers:{
                'Content-Type':'application/json',
            },
            withCredentials:true,
        })
        return response.data
        
    } catch (error) {
        console.log('error in fetching countries',error)
    }

}

    export const fetchLanguages=async ():Promise<any>=>{
        try {
    
            const response= await axios.get(`${BACKEND_URL}/languages`,{
                headers:{
                    'Content-Type':'application/json',
                },
               
            })
            return response.data
            
        } catch (error:any) {
            console.log('error in fetching languages',error.response || error.message)
            return null
        }

}