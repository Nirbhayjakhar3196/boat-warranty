import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

    try {

        await prisma.$queryRaw`Select 1`

        return NextResponse.json({
            success: true,
            message: "Database Connected Successfully 🚀",
        })

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }

}