import fs from "fs/promises"
import path from "path"

export async function saveFile(file) {
    
    if(!file){
        throw new Error("No file uploaded")
    }

    if(file.type != "application/pdf"){
        throw new Error("Only Pdf files are allowed")
    }

    const MAX_SIZE = 5*1024*1024

    if(file.size > MAX_SIZE){
        throw new Error("File Size should be less than 5 MB")
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`

    const filePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        fileName
    )

    await fs.writeFile(filePath , buffer)

    return `/uploads/${fileName}`;
}

