import { getAllProduct, createProduct , getProductById , updateProduct, deleteProduct, findProductBySerial } from "@/repositories/product.repository";

export async function createProductService(data , adminId){

    const existingUser = await findProductBySerial(data.serialNumber)

    if(existingUser){
        throw new Error("Product with this serial number already exist")
    }

    const product = await createProduct({
        ...data,
        adminId
    })

    return product
}

export async function getAllProductService(page , limit) {

    const skip = (page - 1) * limit;

    return await getAllProduct(skip, limit);
}

export async function getProductByIdService(id) {
    
    const product = await getProductById(id)

    if(!product){
        throw new Error("Product not found");
    }

    return product;
}

export async function updateProductService(id , data){

    const product = await getProductById(id)

    if(!product){
        throw new Error("Product not found");
    }

    return await updateProduct(id , data)
}

export async function deleteProductService(id) {
    
    const product = await getProductById(id)

    if(!product){
        throw new Error("Product not found");
    }

    return await deleteProduct(id)
}