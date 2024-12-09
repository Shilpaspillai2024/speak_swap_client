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

 const basicDetailsSchema =z.object({
    name:z
    .string()
    .nonempty({message:"Fullname is required"})
    .trim()
    .min(3,{message:"Name must be atleast 3 characters"}),

    email:z
    .string()
    .nonempty({message:"Email is required"})
    .trim()
    .email({message:"iNvalid email format"}),

    phone:z
    .string()
    .nonempty({message:"Phone number is Required"})
    .regex(/^\d{10}$/,{message:"Phone number must be 10 digits"})

})

const passwordSetupSchema = z.object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/\d/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character" }),
  
      confirmPassword: z
      .string()
      .trim()
      .nonempty("Confirm Password is required")
      .min(6, "Password must be at least 6 characters long"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
  


const languageDetailsSchema = z.object({
    country: z.string().nonempty({ message: "Country is required" }),
    nativeLanguage: z.string().nonempty({ message: "Native language is required" }),
    learnLanguage: z.string().nonempty({ message: "Learn language is required" }),
    learnProficiency: z.string().nonempty({ message: "Learn proficiency is required" }),
    knownLanguages: z.array(z.string().nonempty()).min(1, { message: "At least one known language is required" }),
  });
  
  
  const interestDetailsSchema = z.object({
    talkAbout: z.string().nonempty({ message: "Please specify what you'd like to talk about" }),
    learningGoal: z.string().nonempty({ message: "Learning goal is required" }),
    whyChat: z.string().nonempty({ message: "Why do you want to chat?" }),
  });
  
 
 export const signupValidationSchema = z.object({
    basicDetails: basicDetailsSchema,
    passwordSetupSchema:passwordSetupSchema,
    languageDetails: languageDetailsSchema,
    interestDetails: interestDetailsSchema,
  });

  export const resetpasswordSetupSchema = z.object({
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/\d/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character" }),
  
      confirmPassword: z
      .string()
      .trim()
      .nonempty("Confirm Password is required")
      .min(6, "Password must be at least 6 characters long"),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
  