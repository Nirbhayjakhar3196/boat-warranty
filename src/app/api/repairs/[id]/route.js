import { getRepairByIdService , updateRepairService , deleteRepairService } from "@/services/repair.service";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function GET(request, { params}){
    
    try {
        const {id} = await params

        const repair = await getRepairByIdService(Number(id))

        return NextResponse.json({
            success:true,
            data : repair
        })

    } catch (error) {
        return NextResponse.json({
            success : false,
            message : error.message
        },{status : 404})
    }
}

export async function PUT(request , {params}){

    try {
        const {id} = await params;

        const body = await request.json()

        const repair = await updateRepairService(Number(id) , body)

        return NextResponse.json({
            success : true,
            message: "Repair updated successfully",
            data : repair
        })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message:error.message
        },{status : 400})
    }
}

export async function DELETE(request , {params}){

    try {
        
        const {id} = await params;

        await deleteRepairService(Number(id));

        return NextResponse.json({
            success :true,
            message : "Repair deleted successfully",
        })

    } catch (error) {
        return NextResponse.json({
            success : false,
            message : error.message
        },{status : 404})
    }
}