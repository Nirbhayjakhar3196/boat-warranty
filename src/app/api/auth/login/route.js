import { NextResponse } from "next/server";

import { loginSchema } from "@/validations/login.validation";
import { loginUser } from "@/services/auth.service";
import { success } from "zod";

export async function POST(request){

    try {
        
        const body = await request.json();

        const validateData = loginSchema.parse(body)

        const result = await loginUser(validateData)

        return NextResponse.json({
            success : true,
            message : "Login Successfully",
            data : result
        },{status : 200})


    } catch (error) {

        if (error.name === "ZodError") {
            return NextResponse.json(
                {
                success: false,
                errors: error.issues,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 401 }
        );
        
    }

}