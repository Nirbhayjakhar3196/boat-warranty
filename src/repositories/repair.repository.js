import { prisma } from "@/lib/prisma";

export async function createRepair(data) {
    return prisma.repairHistory.create({
        data
    });
}

export async function getAllRepairs() {
    return prisma.repairHistory.findMany({
        include: {
            product: true
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getRepairById(id) {
    return prisma.repairHistory.findUnique({
        where: {
            id,
        },
        include: {
            product: true
        }
    });
}

export async function updateRepair(id, data) {
    return prisma.repairHistory.update({
        where: {
            id
        },
        data
    });
}

export async function deleteRepair(id) {
    return prisma.repairHistory.delete({
        where: {
            id
        }
    });
}
