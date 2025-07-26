import React from 'react';
import { FileText, Edit2, Trash2, Plus, FileDown } from 'lucide-react';
import { Template } from '../types';

interface TemplateListProps {
  templates: Template[];
  onEdit: (template: Template) => void;
  onDelete: (templateId: string) => void;
  onCreate: () => void;
  onCreateDocument: (template: Template) => void;
}

export function TemplateList({ templates, onEdit, onDelete, onCreate, onCreateDocument }: TemplateListProps) {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">E-Signing Tool</h1>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Neue Vorlage</span>
        </button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Vorlagen vorhanden</h3>
          <p className="text-gray-500 mb-6">Erstellen Sie Ihre erste Vertragsvorlage um zu beginnen.</p>
          <button
            onClick={onCreate}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Erste Vorlage erstellen</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {template.fields.length} Felder
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {template.content.substring(0, 150)}...
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {new Date(template.updatedAt).toLocaleDateString('de-DE')}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onCreateDocument(template)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Dokument erstellen"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(template)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Bearbeiten"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(template.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Löschen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
