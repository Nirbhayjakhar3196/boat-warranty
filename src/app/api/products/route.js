import { getAllProductService , createProductService} from "@/services/product.service";
import { productSchema } from "@/validations/product.validation";
import { NextResponse } from "next/server";
import { success } from "zod";


export async function POST(req) {
    
    try {
        
        const body = await req.json();

        const validateData = productSchema.parse(body)

        const adminId = 1

        const product = await createProductService(validateData , adminId);

        return NextResponse.json({
            success:true,
            message:"Product created successfully",
            data : product
        },
        {status : 201}
    )

    } catch (error) {
        
        return NextResponse.json({
            success: false,
            message : error.message
        },
        {status : 400}
    )
    }

}

export async function GET(){

    try {
        
        const product = await getAllProductService();

        return NextResponse.json({
            success : true,
            data:product
        })

    } catch (error) {
        
        return NextResponse.json({
            success : false,
            message : error.message
        },
        {status : 500}
    )
    }

}

