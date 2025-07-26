import React, { useState, useCallback } from 'react';
import { TemplateList } from './components/TemplateList';
import { TemplateEditor } from './components/TemplateEditor';
import { DocumentForm } from './components/DocumentForm';
import { DocumentViewer } from './components/DocumentViewer';
import { Template, Document, FormData } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { replaceFieldsInContent } from './utils/templateParser';

type AppState = 
  | { type: 'list' }
  | { type: 'edit-template'; template?: Template }
  | { type: 'create-document'; template: Template }
  | { type: 'view-document'; document: Document };

function App() {
  const [templates, setTemplates] = useLocalStorage<Template[]>('e-signing-templates', []);
  const [documents, setDocuments] = useLocalStorage<Document[]>('e-signing-documents', []);
  const [appState, setAppState] = useState<AppState>({ type: 'list' });

  const handleSaveTemplate = useCallback((templateData: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    
    if (appState.type === 'edit-template' && appState.template) {
      // Update existing template
      const updatedTemplate: Template = {
        ...appState.template,
        ...templateData,
        updatedAt: now,
      };
      
      setTemplates(prev => prev.map(t => t.id === appState.template!.id ? updatedTemplate : t));
    } else {
      // Create new template
      const newTemplate: Template = {
        ...templateData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      };
      
      setTemplates(prev => [...prev, newTemplate]);
    }
    
    setAppState({ type: 'list' });
  }, [appState, setTemplates]);

  const handleDeleteTemplate = useCallback((templateId: string) => {
    if (confirm('Sind Sie sicher, dass Sie diese Vorlage löschen möchten?')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  }, [setTemplates]);

  const handleCreateDocument = useCallback((formData: FormData, recipientEmail: string) => {
    if (appState.type !== 'create-document') return;

    const template = appState.template;
    const newDocument: Document = {
      id: Date.now().toString(),
      templateId: template.id,
      templateName: template.name,
      content: template.content,
      fields: formData,
      recipientEmail,
      status: 'pending',
      createdAt: new Date(),
    };

    setDocuments(prev => [...prev, newDocument]);
    
    // Simulate sending email with link
    const documentUrl = `${window.location.origin}/?doc=${newDocument.id}`;
    alert(`Dokument erstellt! Der Link wurde an ${recipientEmail} gesendet:\n\n${documentUrl}\n\n(In einer echten Anwendung würde hier eine E-Mail versendet werden)`);
    
    setAppState({ type: 'view-document', document: newDocument });
  }, [appState, setDocuments]);

  const handleSignatureUpdate = useCallback((documentId: string, signature: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { ...doc, signature, status: 'signed' as const, signedAt: new Date() }
        : doc
    ));
  }, [setDocuments]);

  // Check for document link in URL (simplified for demo)
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const docId = urlParams.get('doc');
    
    if (docId) {
      const document = documents.find(d => d.id === docId);
      if (document) {
        setAppState({ type: 'view-document', document });
      }
    }
  }, [documents]);

  switch (appState.type) {
    case 'list':
      return (
        <TemplateList
          templates={templates}
          onEdit={(template) => setAppState({ type: 'edit-template', template })}
          onDelete={handleDeleteTemplate}
          onCreate={() => setAppState({ type: 'edit-template' })}
          onCreateDocument={(template) => setAppState({ type: 'create-document', template })}
        />
      );
    
    case 'edit-template':
      return (
        <TemplateEditor
          template={appState.template}
          onSave={handleSaveTemplate}
          onCancel={() => setAppState({ type: 'list' })}
        />
      );
    
    case 'create-document':
      return (
        <DocumentForm
          template={appState.template}
          onSubmit={handleCreateDocument}
          onBack={() => setAppState({ type: 'list' })}
        />
      );
    
    case 'view-document':
      return (
        <DocumentViewer
          document={appState.document}
          onSignatureUpdate={handleSignatureUpdate}
        />
      );
    
    default:
      return null;
  }
}

export default App;