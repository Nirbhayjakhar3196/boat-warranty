import { findWarrantyBySerial } from "@/repositories/warranty.repository";

export async function getWarrantyBySerialService(serialNumber) {
    
    const product = await findWarrantyBySerial(serialNumber)

    if(!product){
        throw new Error("Warranty not found")
    }

    const today = new Date();

    const expiryDate = new Date(product.warrantyExpiry)

    const warrantystatus = today <= expiryDate? "ACTIVE" : "EXPIRED"

    return{
        warrantystatus,
        product
    }
}