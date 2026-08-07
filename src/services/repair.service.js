import { getProductById } from "@/repositories/product.repository";
import { getAllRepairs , createRepair , getRepairById, updateRepair, deleteRepair } from "@/repositories/repair.repository";

export async function createRepairService(data){

    const product = await getProductById(data.productId);

    if(!product){
        throw new Error("Product not found")
    }

    const today = new Date();

    const expiry = new Date(product.warrantyExpiry)

    if(today > expiry){
        throw new Error("Warranty Expired")
    }

    return await createRepair({
        ...data,
        status:"PENDING"
    })
}

export async function getAllRepairsService(){
    return await getAllRepairs()
}

export async function getRepairByIdService(id){

    const repair = await getRepairById(id);

    if(!repair){
        throw new Error("Repair not found")
    }

    return repair;
}

export async function updateRepairService(id, data){

    const repair = await getRepairById(id)

    if(!repair){
        throw new Error("Repair not found")
    }

    return updateRepair(id ,data)
}

export async function deleteRepairService(id){

    const repair = await getRepairById(id)

    if(!repair){
        throw new Error("Repair not found")
    }

    return await deleteRepair(id);
}