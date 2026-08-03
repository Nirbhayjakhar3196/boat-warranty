import { getAllRepairsService , createRepairService } from "@/services/repair.service";
import { repairSchema } from "@/validations/repair.validation";
import { NextResponse } from "next/server";

export async function POST(req){

    try {
        
        const body = await req.json();

        const validateData = repairSchema.parse(body);

        const repair = await createRepairService(validateData)

        return NextResponse.json({
            success : true,
            message : "Request pair created successfully",
            data : repair
        },{status : 201})

    } catch (error) {
        
        return NextResponse.json({
            success:false,
            message : error.message
        }, { status: 400 })
    }
}

export async function GET(){

    try {
        const repairs = await getAllRepairsService();

        return NextResponse.json({
            success : true,
            data : repairs
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message : error.message
        }, { status:500})
    }
}