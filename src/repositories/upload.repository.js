
import {prisma} from "@/lib/prisma"

export async function updateWarrantyPdf(productId , pdfUrl){

    return prisma.product.update({
        where:{
            id : productId
        },
        data:{
            warrantyPdfUrl : pdfUrl,
        }
    })
}