// app/api/transactions/[transactionId]/attachments/route.ts
import { NextResponse } from "next/server";
import { uploadTransactionFile } from "@/lib/s3";

export async function POST(
  req: Request,
  context: { params: { transactionId: string } }
) {
  try {
    console.log('API Route - Starting file upload process');

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      console.log('No file provided');
      return new NextResponse("No se proporcionó archivo", { status: 400 });
    }

    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Para archivos temporales, procesamos directamente
    const fileData = await uploadTransactionFile(
      file, 
      "temp-org", // Usamos un orgId temporal para pruebas
      context.params.transactionId
    );

    console.log('File upload successful:', fileData);

    return NextResponse.json(fileData);
  } catch (error) {
    console.error("API Route Error:", error);
    return new NextResponse(
      "Error al procesar el archivo", 
      { status: 500 }
    );
  }
}