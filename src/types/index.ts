export interface Template {
  id: string;
  name: string;
  content: string;
  fields: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  templateId: string;
  templateName: string;
  content: string;
  fields: Record<string, string>;
  recipientEmail: string;
  status: 'pending' | 'signed' | 'completed';
  signature?: string;
  signedAt?: Date;
  createdAt: Date;
}

export interface FormData {
  [key: string]: string;
}
