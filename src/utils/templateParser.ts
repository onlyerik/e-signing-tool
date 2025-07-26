export function extractFieldsFromContent(content: string): string[] {
  // Remove HTML tags first, then extract fields
  const textContent = content.replace(/<[^>]*>/g, ' ');
  const fieldRegex = /\{([^}]+)\}/g;
  const fields: string[] = [];
  let match;
  
  while ((match = fieldRegex.exec(textContent)) !== null) {
    const fieldName = match[1].trim();
    if (!fields.includes(fieldName)) {
      fields.push(fieldName);
    }
  }
  
  return fields;
}

export function replaceFieldsInContent(content: string, fieldValues: Record<string, string>): string {
  let result = content;
  
  Object.entries(fieldValues).forEach(([field, value]) => {
    const regex = new RegExp(`\\{${field}\\}`, 'g');
    result = result.replace(regex, value);
  });
  
  // Replace {DATUM} with current date
  const today = new Date().toLocaleDateString('de-DE');
  result = result.replace(/\{DATUM\}/g, today);
  
  return result;
}
