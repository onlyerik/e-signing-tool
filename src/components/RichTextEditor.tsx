import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Type,
  Palette,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Plus
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onInsertField?: (fieldName: string) => void;
}

const fontFamilies = [
  'Montserrat',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Courier New',
  'Comic Sans MS',
  'Impact',
  'Trebuchet MS'
];

const fontSizes = ['8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '72px'];

const colors = [
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
  '#FF0000', '#FF6600', '#FFCC00', '#00FF00', '#0066FF', '#6600FF',
  '#FF3366', '#FF9933', '#FFFF33', '#33FF33', '#3366FF', '#9933FF'
];

export function RichTextEditor({ content, onChange, onInsertField }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Subscript,
      Superscript,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
        style: 'font-family: Montserrat, sans-serif;'
      },
    },
  });

  const insertField = useCallback((fieldName: string) => {
    if (editor && onInsertField) {
      const field = `{${fieldName}}`;
      editor.chain().focus().insertContent(field).run();
      onInsertField(fieldName);
    }
  }, [editor, onInsertField]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 bg-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          {/* Font Family */}
          <select
            value={editor.getAttributes('textStyle').fontFamily || 'Montserrat'}
            onChange={(e) => {
              if (e.target.value === '') {
                editor.chain().focus().unsetFontFamily().run();
              } else {
                editor.chain().focus().setFontFamily(e.target.value).run();
              }
            }}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            {fontFamilies.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>

          {/* Font Size */}
          <select
            onChange={(e) => {
              if (e.target.value) {
                editor.chain().focus().setFontSize(e.target.value).run();
              }
            }}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="">Größe</option>
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Basic Formatting */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : ''
            }`}
            title="Fett"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : ''
            }`}
            title="Kursiv"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('underline') ? 'bg-blue-100 text-blue-600' : ''
            }`}
            title="Unterstrichen"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('strike') ? 'bg-blue-100 text-blue-600' : ''
            }`}
            title="Durchgestrichen"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Text Color */}
          <div className="relative group">
            <button className="p-2 rounded hover:bg-gray-200 flex items-center" title="Textfarbe">
              <Palette className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-300 rounded shadow-lg hidden group-hover:block z-10">
              <div className="grid grid-cols-6 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => editor.chain().focus().setColor(color).run()}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Highlight */}
          <div className="relative group">
            <button className="p-2 rounded hover:bg-gray-200 flex items-center" title="Markieren">
              <Highlighter className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-300 rounded shadow-lg hidden group-hover:block z-10">
              <div className="grid grid-cols-6 gap-1">
                {colors.slice(6).map((color) => (
                  <button
                    key={color}
                    onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Alignment */}
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-600' : ''
            }`}
            title="Links ausrichten"
          >
            <AlignLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-600' : ''
            }`}
            title="Zentriert"
          >
            <AlignCenter className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-600' : ''
            }`}
            title="Rechts ausrichten"
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-blue-600' : ''
            }`}
            title="Blocksatz"
          >
            <AlignJustify className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Lists */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : ''
            }`}
            title="Aufzählung"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : ''
            }`}
            title="Nummerierung"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('blockquote') ? 'bg-blue-100 text-blue-600' : ''
            }`}
            title="Zitat"
          >
            <Quote className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Subscript/Superscript */}
          <button
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('subscript') ? 'bg-blue-100 text-blue-600' : ''
            }`}
            title="Tiefgestellt"
          >
            <SubscriptIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('superscript') ? 'bg-blue-100 text-blue-600' : ''
            }`}
            title="Hochgestellt"
          >
            <SuperscriptIcon className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Undo/Redo */}
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Rückgängig"
          >
            <Undo className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Wiederholen"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Second Row - Headings and Field Insertion */}
        <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-gray-200">
          {/* Headings */}
          <select
            onChange={(e) => {
              if (e.target.value === 'paragraph') {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().toggleHeading({ level: parseInt(e.target.value) as any }).run();
              }
            }}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="paragraph">Normal</option>
            <option value="1">Überschrift 1</option>
            <option value="2">Überschrift 2</option>
            <option value="3">Überschrift 3</option>
            <option value="4">Überschrift 4</option>
            <option value="5">Überschrift 5</option>
            <option value="6">Überschrift 6</option>
          </select>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Quick Field Insertion */}
          <span className="text-sm text-gray-600">Schnelle Felder:</span>
          {['Vorname', 'Nachname', 'Email', 'DATUM', 'UNTERSCHRIFT'].map((field) => (
            <button
              key={field}
              onClick={() => insertField(field)}
              className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
            >
              {field}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[400px] max-h-[600px] overflow-y-auto">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        />
      </div>
    </div>
  );
}