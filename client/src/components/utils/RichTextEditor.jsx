import { useEffect, useState } from 'react';
import { $getSelection, FORMAT_TEXT_COMMAND } from 'lexical';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { ListNode, ListItemNode, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';

import { FaBold, FaItalic, FaListUl, FaSmile } from 'react-icons/fa';

const theme = {
  text: {
    bold: 'font-bold',
    italic: 'italic',
  },
  list: {
    ul: 'list-disc list-inside',
    listitem: 'ml-2',
  },
  paragraph: 'mb-1',
};

// Emojis básicos
const emojis = [
  '📱',
  '📲',
  '🔋',
  '💡',
  '✅',
  '✨',
  '🛍️',
  '🎁', 
  '💎',
  '🕯️',
  '📦',
  '🛒',
  '💰',
  '🔥',
  '⭐',
  '🎵',
  '🔌',
  '📏',
  '💼',
  '🖤',
];

// Plugin para la toolbar
function ToolbarPlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (selection) {
          setIsBold(selection.hasFormat('bold'));
          setIsItalic(selection.hasFormat('italic'));
        }
      });
      
      // Notificar cambios
      if (onChange) {
        const serialized = JSON.stringify(editorState.toJSON());
        onChange(serialized);
      }
    });
  }, [editor, onChange]);

  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  const insertList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const insertEmoji = (emoji) => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection) {
        selection.insertText(emoji);
      }
    });
    setShowEmojis(false);
  };

  return (
    <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
      <button
        type="button"
        onClick={formatBold}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          isBold ? 'bg-blue-200 text-blue-700' : 'text-gray-600'
        }`}
        title="Negrita"
      >
        <FaBold size={14} />
      </button>
      
      <button
        type="button"
        onClick={formatItalic}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          isItalic ? 'bg-blue-200 text-blue-700' : 'text-gray-600'
        }`}
        title="Cursiva"
      >
        <FaItalic size={14} />
      </button>

      <button
        type="button"
        onClick={insertList}
        className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
        title="Lista"
      >
        <FaListUl size={14} />
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowEmojis(!showEmojis)}
          className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
          title="Emojis"
        >
          <FaSmile size={14} />
        </button>
        
        {showEmojis && (
          <div className="absolute left-0 bottom-full mb-1 z-[1000] bg-white border border-gray-300 rounded-lg shadow-lg p-2 w-48">
            <div className="grid grid-cols-5 gap-1">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="p-1 hover:bg-gray-100 rounded text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function onError(error) {
  console.error(error);
}

export default function RichTextEditor({ 
  value = '', 
  onChange, 
  placeholder = 'Escribe aquí...' 
}) {
  // Función para crear un estado inicial desde texto plano
  const createInitialState = (text) => {
    if (!text) return null;
    
    // Si el valor ya es JSON (formato Lexical), usarlo directamente
    try {
      JSON.parse(text);
      return text;
    } catch {
      // Si es texto plano, crear un estado Lexical básico
      return JSON.stringify({
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: text,
                  type: "text",
                  version: 1
                }
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1
            }
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1
        }
      });
    }
  };

  const initialConfig = {
    namespace: 'RichTextEditor',
    theme,
    onError,
    nodes: [
      ListNode,
      ListItemNode,
    ],
    editorState: createInitialState(value),
  };

  return (
    <div className="border border-gray-300 rounded-lg">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin onChange={onChange} />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="min-h-[80px] p-3 outline-none text-sm leading-relaxed"
                aria-placeholder={placeholder}
              />
            }
            placeholder={
              <div className="absolute top-3 left-3 text-gray-400 pointer-events-none text-sm">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <AutoFocusPlugin />
      </LexicalComposer>
    </div>
  );
}