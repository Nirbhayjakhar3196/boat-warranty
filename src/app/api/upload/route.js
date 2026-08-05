import { NextResponse } from "next/server";
import { uploadWarrantyService } from "@/services/upload.service";
import { saveFile } from "@/utils/fileUpload";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf") || formData.get("file");
    const productId = formData.get("productId");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No PDF file uploaded" },
        { status: 400 }
      );
    }

    if (productId) {
      const updatedProduct = await uploadWarrantyService(Number(productId), file);
      return NextResponse.json({
        success: true,
        message: "Warranty PDF uploaded and attached successfully",
        data: updatedProduct,
        url: updatedProduct.warrantyPdfUrl,
      });
    } else {
      const pdfUrl = await saveFile(file);
      return NextResponse.json({
        success: true,
        message: "PDF uploaded successfully",
        url: pdfUrl,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to upload file" },
      { status: 400 }
    );
  }
}
