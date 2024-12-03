export interface LoginErrors{

    email?:string,
    password?:string,
    general?:string

}

export interface SignupErrors{
   
        name?: string;
        email?: string;
        phone?: string;
      
       [key:string]:string |undefined;
    
}