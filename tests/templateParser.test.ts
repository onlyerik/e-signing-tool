import { describe, it, expect } from 'vitest';
import { extractFieldsFromContent, replaceFieldsInContent } from '../src/utils/templateParser';

describe('templateParser utilities', () => {
  it('extractFieldsFromContent should return unique field names from HTML', () => {
    const html = '<p>Hello {NAME}, your id is {ID}. <span>Again {NAME}</span> {DATUM}</p>';
    const fields = extractFieldsFromContent(html);
    expect(fields).toEqual(['NAME', 'ID', 'DATUM']);
  });

  it('replaceFieldsInContent should substitute fields and insert the current date', () => {
    const template = 'Hello {NAME}, today is {DATUM}. Your id: {ID}.';
    const values = { NAME: 'Alice', ID: '42' };
    const today = new Date().toLocaleDateString('de-DE');
    const result = replaceFieldsInContent(template, values);
    expect(result).toBe(`Hello Alice, today is ${today}. Your id: 42.`);
  });
});
