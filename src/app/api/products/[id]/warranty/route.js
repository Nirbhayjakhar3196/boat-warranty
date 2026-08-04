import { uploadWarrantyService } from "@/services/upload.service";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function POST(request , {params}) {
    
    try {
        
        const {id} = await params

        const formData = await request.formData();

        const file = formData.get("file")

        const product = await uploadWarrantyService(
            Number(id),
            file
        )

        return NextResponse.json({
            success : true,
            message :"Warranty uploaded successfully",
            data : product
        }, {status : 201})

    } catch (error) {
        
        return NextResponse.json({
            success : false,
            message: error.message
        }, {status : 400})
    }

}