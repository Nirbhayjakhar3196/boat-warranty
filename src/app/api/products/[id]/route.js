import { getProductByIdService , updateProductService , deleteProductService } from "@/services/product.service";
import { productSchema } from "@/validations/product.validation";
import { NextResponse } from "next/server";


export async function GET(req , {params}){

    try {

        const {id} = await params

        const product = await getProductByIdService(Number(id))

        return NextResponse.json({
            success : true,
            data : product
        })

    } catch (error) {
        return NextResponse.json({
            success : false,
            message : error.message
        },{status : 404})
    }
}

export async function PUT(req , {params}){

    try {
        
        const {id} = await params

        const body = await req.json();

        const validateData = productSchema.parse(body)

        const product = await updateProductService(Number(id), validateData)

        return NextResponse.json({
            success : true,
            message : "Product update Successfully",
            data : product
        })

    } catch (error) {
        
        return NextResponse.json({
            success : false,
            message : error.message
        },{status: 400})
    }
}

export async function DELETE( req , {params}) {

    try {
        const {id} = await params

        await deleteProductService(Number(id))

        return NextResponse.json({
            success : true,
            message: "Product Deleted Successfully"
        })
    } catch (error) {
        
        return NextResponse.json({
            success : false,
            message : error.message
        },{status: 404})
    }    
}
