import {create} from 'zustand'

interface SignupState{
    token:string;
    setToken:(token:string)=>void
    clearToken:()=>void
}
 const userSignupStore =create<SignupState>((set)=>({
    token:"",
    setToken:(token:string)=>set({token}),
    clearToken:()=>set({token:""})
}))


export default userSignupStore