import {NextResponse} from "next/server";

import {registerUser} from "@/services/auth.service"
import {registerSchema} from "@/validations/auth.validation"
import {successResponse , errorResponse} from "@/utils/apiResponse"


export async function POST(request){

    try {
        
        const body = await request.json();

        const validateData = registerSchema.parse(body)

        const user = await registerUser(validateData);

        return successResponse("User registered successfully",user,201)

    } catch (error) {
        
        console.log(error);

        if (error.name === "ZodError") {
            return errorResponse("Validation Error",400,error.issues)
        }

        return errorResponse(error.message,500)
        
    }

}