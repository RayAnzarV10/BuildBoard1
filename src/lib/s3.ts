// lib/s3.ts
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Imprimimos las variables de entorno para debug (sin imprimir los valores sensibles)
console.log('AWS Config:', {
  region: process.env.AWS_REGION,
  bucketName: process.env.AWS_BUCKET_NAME,
  hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
});

// Inicializar el cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function uploadTransactionFile(
  file: File,
  orgId: string,
  transactionId: string
) {
  try {
    // Crear una clave única para S3
    const s3Key = `${orgId}/transactions/${transactionId}/${Date.now()}-${file.name}`;
    
    console.log('Attempting to upload with key:', s3Key);
    
    // Convertir el archivo a buffer
    const buffer = await file.arrayBuffer();
    
    // Subir a S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
      Body: Buffer.from(buffer),
      ContentType: file.type
    });

    console.log('Upload command:', {
      bucket: process.env.AWS_BUCKET_NAME,
      key: s3Key,
      contentType: file.type
    });

    const result = await s3Client.send(command);
    
    console.log('Upload successful:', result);

    // Devolver la información para guardar en la base de datos
    return {
      name: file.name,
      type: file.type,
      s3Key: s3Key,
      size: file.size,
    };
  } catch (error) {
    console.error('Error uploading file:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorName: error instanceof Error ? error.name : 'Unknown error type'
    });
    throw new Error('Error al subir el archivo');
  }
}