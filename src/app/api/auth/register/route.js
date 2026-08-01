import {NextResponse} from "next/server";

import {registerUser} from "@/services/auth.service"
import {registerSchema} from "@/validations/auth.validation"


export async function POST(request){

    try {
        
        const body = await request.json();

        const validateData = registerSchema.parse(body)

        const user = await registerUser(validateData);

        return NextResponse.json({
            success: true,
            message : "User registered Successfully"
        },{status : 201})

    } catch (error) {
        
        console.log(error);

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
                message: error.message || "Something went wrong",
            },
            { status: 500 }
        );
        
    }

}