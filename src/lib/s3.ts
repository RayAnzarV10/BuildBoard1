import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Inicializar el cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Función para subir archivo
export async function uploadTransactionFile(
  file: File,
  orgId: string,
  transactionId: string
) {
  try {
    // Crear una clave única para S3
    const s3Key = `${orgId}/transactions/${transactionId}/${Date.now()}-${file.name}`;
    
    // Convertir el archivo a buffer
    const buffer = await file.arrayBuffer();
    
    // Subir a S3
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: s3Key,
      Body: Buffer.from(buffer),
      ContentType: file.type
    }));

    // Devolver la información para guardar en la base de datos
    return {
      name: file.name,
      type: file.type,
      s3Key: s3Key,
      size: file.size,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Error al subir el archivo');
  }
}

// Función para obtener archivo
export async function getTransactionFile(s3Key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: s3Key
    });
    
    const response = await s3Client.send(command);
    return response.Body;
  } catch (error) {
    console.error('Error getting file:', error);
    throw new Error('Error al obtener el archivo');
  }
}

// Función para eliminar archivo
export async function deleteTransactionFile(s3Key: string) {
  try {
    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: s3Key
    }));
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Error al eliminar el archivo');
  }
}