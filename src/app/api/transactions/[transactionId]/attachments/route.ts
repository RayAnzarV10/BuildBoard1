// app/api/transactions/[transactionId]/attachments/route.ts
import { NextResponse } from "next/server";
import { uploadTransactionFile } from "@/lib/s3";
import { attachment, getAuthUserDetails, transaction, verifyAndAcceptInvitation } from "@/lib/queries";
import { get } from "http";

export async function POST(
  req: Request,
  { params }: { params: { transactionId: string } }
) {
  try {
    const orgId = await verifyAndAcceptInvitation()
    const userId = await getAuthUserDetails();
    if (!userId || !orgId) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return new NextResponse("No se proporcionó archivo", { status: 400 });
    }

    const response = await transaction(orgId, params.transactionId);

    if (!response) {
      return new NextResponse("Transacción no encontrada", { status: 404 });
    }

    // Subir archivo a S3
    const fileData = await uploadTransactionFile(file, orgId as string, params.transactionId);

    // Guardar referencia en la base de datos
    const attachmentResponse = await attachment(fileData, params.transactionId);

    return NextResponse.json(attachmentResponse);
  } catch (error) {
    console.error("[TRANSACTION_ATTACHMENT_POST]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}