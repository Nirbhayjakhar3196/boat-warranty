import { prisma } from "@/lib/prisma";

export async function findUserByEmail(email){

    return prisma.user.findUnique({
        where:{
            email,
        }
    })
}

export async function createUser(data){

    return prisma.user.create({
        data,
    })
}