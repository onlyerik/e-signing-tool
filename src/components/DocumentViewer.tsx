import React, { useState, useRef } from 'react';
import { FileText, Download, Mail } from 'lucide-react';
import { Document } from '../types';
import { replaceFieldsInContent } from '../utils/templateParser';
import { SignatureCapture } from './SignatureCapture';
import { generatePDF } from '../utils/pdfGenerator';

interface DocumentViewerProps {
  document: Document;
  onSignatureUpdate: (documentId: string, signature: string) => void;
}

export function DocumentViewer({ document, onSignatureUpdate }: DocumentViewerProps) {
  const [signature, setSignature] = useState<string | null>(document.signature || null);
  const [isSigning, setIsSigning] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  const documentContent = replaceFieldsInContent(document.content, document.fields);
  const hasSignatureField = document.content.includes('{UNTERSCHRIFT}');

  const handleSignatureChange = (newSignature: string | null) => {
    setSignature(newSignature);
    if (newSignature) {
      onSignatureUpdate(document.id, newSignature);
    }
  };

  const handleDownloadPDF = async () => {
    if (!documentRef.current) return;

    setIsGeneratingPDF(true);
    try {
      const filename = `${document.templateName}_${document.recipientEmail}_${new Date().toISOString().split('T')[0]}.pdf`;
      await generatePDF(documentRef.current, filename);
    } catch (error) {
      alert('Fehler beim Erstellen der PDF-Datei');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const sendByEmail = () => {
    const subject = encodeURIComponent(`Ihr signiertes Dokument: ${document.templateName}`);
    const body = encodeURIComponent(`Sehr geehrte Damen und Herren,

im Anhang finden Sie Ihr signiertes Dokument "${document.templateName}".

Mit freundlichen Grüßen`);
    
    window.open(`mailto:${document.recipientEmail}?subject=${subject}&body=${body}`);
  };

  const renderContent = () => {
    let content = documentContent;
    
    if (hasSignatureField) {
      if (signature) {
        content = content.replace(
          '{UNTERSCHRIFT}',
          `<div style="margin: 20px 0; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
            <img src="${signature}" alt="Unterschrift" style="max-width: 200px; height: auto;" />
            <div style="font-size: 12px; color: #666; margin-top: 5px;">
              Elektronisch signiert am ${new Date().toLocaleDateString('de-DE')}
            </div>
          </div>`
        );
      } else {
        content = content.replace(
          '{UNTERSCHRIFT}',
          '<div style="margin: 20px 0; padding: 20px; border: 2px dashed #ccc; border-radius: 4px; text-align: center; color: #666;">Unterschriftsfeld - Bitte signieren</div>'
        );
      }
    }

    return content;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{document.templateName}</h1>
                <p className="text-sm text-gray-600">Empfänger: {document.recipientEmail}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                document.status === 'signed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {document.status === 'signed' ? 'Signiert' : 'Ausstehend'}
              </span>
              {signature && (
                <>
                  <button
                    onClick={sendByEmail}
                    className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Per E-Mail senden</span>
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isGeneratingPDF ? 'Erstelle PDF...' : 'PDF Download'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          <div 
            ref={documentRef}
            className="prose max-w-none mb-8"
            style={{ 
              fontFamily: 'serif',
              lineHeight: '1.6',
              fontSize: '14px'
            }}
            dangerouslySetInnerHTML={{ __html: renderContent().replace(/\n/g, '<br>') }}
          />

          {hasSignatureField && !signature && (
            <div className="mt-8 border-t pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Dokument signieren
              </h3>
              <SignatureCapture
                onSignatureChange={handleSignatureChange}
                existingSignature={signature || undefined}
              />
              <p className="text-sm text-gray-600 mt-4">
                Bitte setzen Sie Ihre Unterschrift in das Feld oben. Nach der Signierung können Sie das Dokument als PDF herunterladen.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
