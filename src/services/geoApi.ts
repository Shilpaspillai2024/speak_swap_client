import axios from 'axios'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export interface Country {
   
    name: string;
  }
//fetch the countries
export const fetchCountries=async ():Promise<Country[]>=>{
    try {

        const response= await axios.get(`${BACKEND_URL}/geo/countries`,{
            headers:{
                'Content-Type':'application/json',
            },
            withCredentials:true,
        })
        console.log("countries",response.data)
        return response.data
        
    } catch (error) {
        console.log('error in fetching countries',error)
        return [];
    }

}

    export const fetchLanguages=async ():Promise<string[]>=>{
        try {
    
            const response= await axios.get(`${BACKEND_URL}/geo/languages`,{
                headers:{
                    'Content-Type':'application/json',
                },
               
            })
            console.log("languages",response.data)
            return response.data
            
        } catch (error: unknown) {
            console.log('Error in fetching languages:', error);
            if (axios.isAxiosError(error)) {
              console.log('Axios error response:', error.response);
              return [];
            } else if (error instanceof Error) {
              console.log('Error message:', error.message);
              return [];
            } else {
              console.log('Unknown error:', error);
              return [];
            }
          }

}