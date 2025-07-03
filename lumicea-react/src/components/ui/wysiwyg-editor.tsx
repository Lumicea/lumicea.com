import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Label } from './label';

interface WysiwygEditorProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  className?: string;
  error?: string;
  required?: boolean;
  toolbarOptions?: string[][];
}

export function WysiwygEditor({
  id,
  label,
  value,
  onChange,
  placeholder = 'Start typing...',
  height = '300px',
  className = '',
  error,
  required = false,
  toolbarOptions,
}: WysiwygEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [editorValue, setEditorValue] = useState(value);

  // Default toolbar options
  const defaultToolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean'],
    ['link', 'image', 'video']
  ];

  // Use client-side only to avoid SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const handleChange = (content: string) => {
    setEditorValue(content);
    onChange(content);
  };

  const modules = {
    toolbar: toolbarOptions || defaultToolbarOptions,
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background', 'align',
    'code-block', 'script', 'direction',
  ];

  if (!mounted) {
    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={id} className={required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
            {label}
          </Label>
        )}
        <div 
          className="w-full h-[300px] border border-input rounded-md bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={id} className={required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
          {label}
        </Label>
      )}
      <div className="wysiwyg-editor-container">
        <ReactQuill
          id={id}
          theme="snow"
          value={editorValue}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{ height }}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <style>{`
        .wysiwyg-editor-container .ql-container {
          height: calc(${height} - 42px);
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          border-color: hsl(var(--input));
        }
        .wysiwyg-editor-container .ql-toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          border-color: hsl(var(--input));
        }
        .wysiwyg-editor-container .ql-editor {
          font-size: 0.875rem;
        }
        .wysiwyg-editor-container .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
          font-style: normal;
        }
      `}</style>
    </div>
  );
}