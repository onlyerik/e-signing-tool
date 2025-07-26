import React, { useState, useCallback } from 'react';
import { FileText, Save, Eye } from 'lucide-react';
import { Template } from '../types';
import { extractFieldsFromContent } from '../utils/templateParser';
import { RichTextEditor } from './RichTextEditor';

interface TemplateEditorProps {
  template?: Template;
  onSave: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function TemplateEditor({ template, onSave, onCancel }: TemplateEditorProps) {
  const [name, setName] = useState(template?.name || '');
  const [content, setContent] = useState(template?.content || '');
  const [isPreview, setIsPreview] = useState(false);

  const handleSave = useCallback(() => {
    if (!name.trim() || !content.trim()) {
      alert('Bitte füllen Sie alle Felder aus');
      return;
    }

    const fields = extractFieldsFromContent(content);
    onSave({
      name: name.trim(),
      content: content.trim(),
      fields,
    });
  }, [name, content, onSave]);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            {template ? 'Vorlage bearbeiten' : 'Neue Vorlage erstellen'}
          </h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>{isPreview ? 'Editor' : 'Vorschau'}</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Speichern</span>
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vorlagenname
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="z.B. Arbeitsvertrag Standard"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vertragsinhalt
          </label>
          {isPreview ? (
            <div 
              className="w-full min-h-[400px] p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto prose prose-sm max-w-none"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              dangerouslySetInnerHTML={{ __html: content || 'Keine Inhalte vorhanden...' }}
            >
            </div>
          ) : (
            <RichTextEditor
              content={content}
              onChange={handleContentChange}
            />
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Verwendung von dynamischen Feldern:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Verwenden Sie die Schnellauswahl-Buttons in der Toolbar für häufige Felder</li>
          <li>• Spezielle Felder: <code>{'{DATUM}'}</code> (heutiges Datum), <code>{'{UNTERSCHRIFT}'}</code> (Unterschriftsfeld)</li>
          <li>• Eigene Felder: Tippen Sie <code>{'{Feldname}'}</code> direkt in den Text</li>
        </ul>
      </div>
    </div>
  );
}
