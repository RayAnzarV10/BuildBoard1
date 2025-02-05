export const formatPhoneNumber = (phoneNumber: string) => {
  // Elimina cualquier caracter que no sea número
  const cleaned = phoneNumber.replace(/\D/g, '');
  // Aplica el formato
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
};