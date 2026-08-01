import { NextResponse } from "next/server";

import { loginSchema } from "@/validations/login.validation";
import { loginUser } from "@/services/auth.service";
import { successResponse, errorResponse } from "@/utils/apiResponse";

export async function POST(request){

    try {
        
        const body = await request.json();

        const validateData = loginSchema.parse(body)

        const result = await loginUser(validateData)

        return successResponse("Login successful",result,200)


    } catch (error) {

        if (error.name === "ZodError") {
            return errorResponse("Validation Error",400,error.issues)
        }

        return errorResponse(error.message,500)
        
    }

}