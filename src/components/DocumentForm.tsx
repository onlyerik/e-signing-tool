import React, { useState, useCallback } from 'react';
import { FileText, Send, ArrowLeft } from 'lucide-react';
import { Template, FormData } from '../types';

interface DocumentFormProps {
  template: Template;
  onSubmit: (formData: FormData, recipientEmail: string) => void;
  onBack: () => void;
}

export function DocumentForm({ template, onSubmit, onBack }: DocumentFormProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const missingFields = template.fields.filter(field => 
      field !== 'DATUM' && field !== 'UNTERSCHRIFT' && !formData[field]?.trim()
    );
    
    if (missingFields.length > 0) {
      alert(`Bitte füllen Sie alle Felder aus: ${missingFields.join(', ')}`);
      return;
    }
    
    if (!recipientEmail.trim()) {
      alert('Bitte geben Sie eine E-Mail-Adresse ein');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData, recipientEmail);
    } finally {
      setIsSubmitting(false);
    }
  }, [template.fields, formData, recipientEmail, onSubmit]);

  const visibleFields = template.fields.filter(field => 
    field !== 'DATUM' && field !== 'UNTERSCHRIFT'
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dokument erstellen</h2>
            <p className="text-gray-600">Vorlage: {template.name}</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Empfänger-Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-Mail-Adresse des Empfängers *
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="empfaenger@beispiel.de"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {visibleFields.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dokument-Daten</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleFields.map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field} *
                  </label>
                  <input
                    type={field === 'Email' ? 'email' : field === 'Telefon' ? 'tel' : 'text'}
                    value={formData[field] || ''}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    placeholder={`${field} eingeben...`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Automatische Felder</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Datum wird automatisch als heutiges Datum eingefügt</li>
            <li>• Unterschriftsfeld wird dem Empfänger zur Signierung bereitgestellt</li>
          </ul>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Wird gesendet...' : 'Link senden'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}