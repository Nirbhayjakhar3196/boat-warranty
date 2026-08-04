import { getProductById } from "@/repositories/product.repository";
import { updateWarrantyPdf } from "@/repositories/upload.repository";
import { saveFile } from "@/utils/fileUpload";

export async function uploadWarrantyService(productId , file){

    const product = await getProductById(productId)

    if(!product){
        throw new Error("Product not found")
    }

    const pdfUrl = await saveFile(file);

    const updatedProduct = await updateWarrantyPdf(
        productId,
        pdfUrl
    )

    return updatedProduct;

}