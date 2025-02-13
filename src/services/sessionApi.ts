import userAxiosInstance from "./userAxiosInstance";
import tutorAxiosInstance from "./tutorAxiosInstance";

export const createSession=async(bookingId:string,userId:string,tutorId:string,selectedDate:string,duration:number,userRole:string)=>{
    try {
        const instance = userRole === "user" ? userAxiosInstance : tutorAxiosInstance;
        const response=await instance.post('/session/start',{
            bookingId,
            userId,
            tutorId,
            selectedDate,
            duration,
            userRole
        });
        return response.data;


    } catch (error) {
        console.error("❌ Error creating session:", error);
    return { error: "Failed to create session" };
    }
    
}