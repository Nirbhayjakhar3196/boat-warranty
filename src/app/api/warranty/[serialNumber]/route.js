import { getWarrantyBySerialService } from "@/services/warranty.service"
import { NextResponse } from "next/server";
import { success } from "zod";

export async function GET(req , {params}){

    try {
        
        const {serialNumber} = await params;

        const warranty = await getWarrantyBySerialService(serialNumber);

        return NextResponse.json({
            success : true,
            message : "Warranty fetched successfully",
            data : warranty
        },{status: 200})

    } catch (error) {
        return NextResponse.json({
            success : false,
            message : error.message
        },{status : 404})
    }

}