import { API_BASE_URL } from "@/services/api";

export interface ParsedInvoiceData {
  fournisseur: string;
  typeFacture: string;
  montant: number;
  dateEmission: Date;
  dateEcheance: Date;
  statut: string;
  moyenPaiement: string;
}

// Function to parse OCR text into structured data
export function parseOCRText(ocrText: string): ParsedInvoiceData {
  const lines = ocrText.split('\n').filter(line => line.trim());
  
  // Default values
  let parsedData: ParsedInvoiceData = {
    fournisseur: 'Non spécifié',
    typeFacture: 'Facture',
    montant: 0,
    dateEmission: new Date(),
    dateEcheance: new Date(),
    statut: 'En attente',
    moyenPaiement: 'Non spécifié'
  };

  // Parse supplier (usually at the top)
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (firstLine && !firstLine.includes('FACTURE') && !firstLine.includes('DESTINATAIRE')) {
      parsedData.fournisseur = firstLine;
    }
  }

  // Parse invoice number and dates
  for (const line of lines) {
    const upperLine = line.toUpperCase();
    
    // Look for invoice number
    if (upperLine.includes('FACTURE N') || upperLine.includes('INVOICE N')) {
      const match = line.match(/\d+/);
      if (match) {
        parsedData.typeFacture = `Facture N°${match[0]}`;
      }
    }
    
    // Look for dates
    if (upperLine.includes('DATE') && upperLine.includes('FACTURE')) {
      const dateMatch = line.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (dateMatch) {
        const [, day, month, year] = dateMatch;
        parsedData.dateEmission = new Date(`${year}-${month}-${day}`);
      }
    }
    
    if (upperLine.includes('ÉCHÉANCE') || upperLine.includes('ECHEANCE')) {
      const dateMatch = line.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (dateMatch) {
        const [, day, month, year] = dateMatch;
        parsedData.dateEcheance = new Date(`${year}-${month}-${day}`);
      }
    }
    
    // Look for total amount
    if (upperLine.includes('TOTAL TTC') || upperLine.includes('TOTAL')) {
      const amountMatch = line.match(/(\d+[\s,.]?\d*)[€\s]/);
      if (amountMatch) {
        const amount = amountMatch[1].replace(/[\s,]/g, '.').replace(/[^\d.]/g, '');
        parsedData.montant = parseFloat(amount) || 0;
      }
    }
  }

  return parsedData;
}

// API service to send data to your backend
export async function saveInvoiceToAPI(invoiceData: ParsedInvoiceData, userId: number): Promise<any> {
  const BASE_URL = process.env.NODE_ENV === 'development' 
    ? API_BASE_URL // Replace with your actual API URL
    : 'https://your-production-api.com';

  try {
    const response = await fetch(`${BASE_URL}/api/factures/ocr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        ocrData: {
          fournisseur: invoiceData.fournisseur,
          typeFacture: invoiceData.typeFacture,
          montant: invoiceData.montant.toString(),
          dateEmission: invoiceData.dateEmission.toISOString(),
          dateEcheance: invoiceData.dateEcheance.toISOString(),
          statut: invoiceData.statut,
          moyenPaiement: invoiceData.moyenPaiement
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving invoice:', error);
    throw error;
  }
}