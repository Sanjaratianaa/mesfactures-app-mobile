import { API_BASE_URL } from "@/services/api";

export async function saveInvoiceOCR(ocrData: any, userId: number) {
  const token = localStorage.getItem('auth_token'); 
  const body = {
    utilisateurId: userId,
    ...ocrData
  };

  const res = await fetch(`${API_BASE_URL}/factures/factures`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

// OCR + fichier
export async function saveInvoiceWithFile(file: File, factureId: number) {
  const token = localStorage.getItem('auth_token'); 
  const formData = new FormData();
  formData.append("factureId", factureId.toString()); // obligatoire pour le backend
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/factures/fichiers/upload`, {
    method: "POST",
    headers: {"Authorization": `Bearer ${token}`},
    body: formData,
  });

  return res.json();
}