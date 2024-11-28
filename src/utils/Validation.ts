import {z} from 'zod'



//zod validation for login forms

export const loginSchema =z.object({
    email:z
    .string()
    .nonempty({message:"email is required"})
    .trim()
    .email("Invalid email format"),

    password:z
    .string()
    .nonempty({message:"Password is required"})
    .trim()
    .min(6,"Password must bet at least 6 characters")
    .regex(/[a-zA-Z]/,{message:"Password must contain atleast one character"})
    .regex(/[0-9]/,{message:"password must contain at least one number "})
});