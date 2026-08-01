import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createProduct(data){

    return prisma.product.create({
        data
    })
}

export async function findProductBySerial(serialNumber) {
    
    return prisma.product.findUnique({
        where:{
            serialNumber
        }
    })
}

export async function getAllProduct(){

    return prisma.product.findMany({
        orderBy:{
            createdAt : "desc"
        }
    })
}

export async function getProductById(id){

    return prisma.product.findUnique({
        where : {
            id
        }
    })
}

export async function updateProduct(id, data) {
    
    return prisma.product.update({
        where : {id},
        data
    })
}

export async function deleteProduct(id) {
    
    return prisma.product.delete({
        where:{
            id
        }
    })
}