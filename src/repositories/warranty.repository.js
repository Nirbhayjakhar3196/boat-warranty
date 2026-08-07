import { prisma, Prisma } from "@/lib/prisma";

export async function findWarrantyBySerial(serialNumber) {

    return prisma.product.findUnique({
        where: {
            serialNumber
        },
        include: {
            repairs: true
        }
    })
}

