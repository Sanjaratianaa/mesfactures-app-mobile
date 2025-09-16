
"use client"
import Tesseract from "tesseract.js"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { parseOCRText, ParsedInvoiceData } from '../utils/ocrParser';
import { saveInvoiceOCR, saveInvoiceWithFile } from "@/services/factures.api";

interface AddInvoiceModalProps {
  open: boolean
  onClose: () => void
  onAdd?: (invoice: any) => void // à compléter selon vos besoins
}

export function AddInvoiceModal({ open, onClose, onAdd }: AddInvoiceModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [ocrText, setOcrText] = useState("")
  const [loading, setLoading] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [ocrLoading, setOcrLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [parsedData, setParsedData] = useState<ParsedInvoiceData | null>(null);
  const [saving, setSaving] = useState(false);

  // Lancer l'OCR sur le fichier image/photo
  const handleOcr = async (targetFile?: File) => {
    const fileToUse = targetFile || file;
    if (!fileToUse) return;
    setOcrLoading(true);
    setOcrText("");
    setParsedData(null);
    
    try {
      const { data: { text } } = await Tesseract.recognize(fileToUse, 'fra', {
        workerPath: '/tesseract-worker.js',
        corePath: '/tesseract-core-simd-lstm.wasm.js',
        langPath: '/',
      });
      setOcrText(text);
      
      // Parse the OCR text into structured data
      const parsed = parseOCRText(text);
      setParsedData(parsed);
    } catch (err) {
      setOcrText("Erreur lors de l'extraction du texte");
    }
    setOcrLoading(false);
  };

  const handleSaveInvoice = async () => {
    if (!parsedData) return;
    setSaving(true);

    try {
      const userId = 1;

      const invoiceResult = await saveInvoiceOCR(parsedData, userId);
      const factureId = invoiceResult.data?.id; 
    if (!factureId) throw new Error("Impossible de récupérer l'ID de la facture");

      if (file) {
        await saveInvoiceWithFile(file, factureId);
      }
      
      // Reset form
      setFile(null);
      setPhotoPreview(null);
      setOcrText("");
      setParsedData(null);
      onClose();
    } catch (error) {
      alert('Erreur lors de l\'enregistrement de la facture');
      console.error('Save error:', error);
    }
    setSaving(false);
  };

  // TODO: Intégrer Tesseract.js ou API OCR ici
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setPhotoPreview(URL.createObjectURL(e.target.files[0]))
      handleOcr(e.target.files[0]);
    }
  }

  // Camera logic
  const handleOpenCamera = async () => {
    setShowCamera(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (err) {
      alert("Impossible d'accéder à la caméra")
      setShowCamera(false)
    }
  }

  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 320, 240)
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const photoFile = new File([blob], "photo.jpg", { type: blob.type })
            setFile(photoFile)
            const previewUrl = URL.createObjectURL(blob)
            setPhotoPreview(previewUrl)
            handleOcr(photoFile);
          }
        }, "image/jpeg")
      }
    }
    // Stop camera
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    setShowCamera(false)
  }

  const handleCloseCamera = () => {
    handleOcr(); // Lancer l'OCR après avoir pris la photo
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    setShowCamera(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md sm:max-w-md p-2 sm:p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Ajouter une facture</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Importez une photo ou un PDF de votre facture, ou prenez une photo avec la caméra.
        </DialogDescription>
  <div className="space-y-4 w-full">
          {/* Import photo/PDF */}
          <div className="space-y-2">
            <Label htmlFor="invoice-file">Facture photo / PDF</Label>
            <Input id="invoice-file" type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
          </div>
          {/* Prendre une photo */}
          <div className="space-y-2">
            <Button type="button" variant="secondary" onClick={handleOpenCamera}>
              Prendre une photo
            </Button>
            {showCamera && (
              <div className="flex flex-col items-center space-y-2">
                <video ref={videoRef} width={320} height={240} autoPlay className="rounded border" />
                <canvas ref={canvasRef} width={320} height={240} style={{ display: "none" }} />
                <div className="flex gap-2">
                  <Button type="button" onClick={handleTakePhoto}>Capturer</Button>
                  <Button type="button" variant="outline" onClick={handleCloseCamera}>Annuler</Button>
                </div>
              </div>
            )}
          </div>
          {/* Aperçu de la photo capturée ou importée + OCR */}
          {photoPreview && (
            <div className="flex flex-col items-center space-y-2 w-full">
              <img src={photoPreview} alt="Aperçu" className="w-full max-w-xs sm:max-w-sm h-auto rounded border object-contain" style={{ aspectRatio: '4/3' }} />
              <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full justify-center">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setPhotoPreview(null);
                    setFile(null);
                    handleOpenCamera();
                  }}
                >
                  Refaire la photo
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => { setPhotoPreview(null); setFile(null); }}>
                  Supprimer la photo
                </Button>
                <Button type="button" size="sm" variant="default" onClick={() => handleOcr()} disabled={ocrLoading}>
                  {ocrLoading ? "Extraction..." : "Extraire le texte"}
                </Button>
              </div>
            </div>
          )}
          {/* Affichage du texte OCR extrait (pour test) */}
          {ocrText && (
            <div className="bg-gray-100 p-2 rounded text-xs w-full overflow-x-auto">
              <strong>Texte extrait :</strong>
              <pre className="whitespace-pre-wrap break-words">{ocrText}</pre>
            </div>
          )}
          {parsedData && (
            <div className="bg-blue-50 p-3 rounded text-sm space-y-2">
              <strong>Données extraites :</strong>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><strong>Fournisseur:</strong> {parsedData.fournisseur}</div>
                <div><strong>Type:</strong> {parsedData.typeFacture}</div>
                <div><strong>Montant:</strong> {parsedData.montant}€</div>
                <div><strong>Date émission:</strong> {parsedData.dateEmission.toLocaleDateString()}</div>
                <div><strong>Date échéance:</strong> {parsedData.dateEcheance.toLocaleDateString()}</div>
                <div><strong>Statut:</strong> {parsedData.statut}</div>
              </div>
            </div>
          )}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="button" 
              className="flex-1 bg-primary hover:bg-primary/90" 
              disabled={!parsedData || saving}
              onClick={handleSaveInvoice}
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}