// @refresh reset
import React, { useState, useCallback, useEffect } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import CharacterCount from '@tiptap/extension-character-count';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import MenuBar from './MenuBar';
import Mention from './customMention';
import suggestion from './autosuggestion';

interface Props {
  className?: string;
  user: string;
}
const colors = [
  '#958DF1',
  '#F98181',
  '#FBBC88',
  '#FAF594',
  '#70CFF8',
  '#94FADB',
  '#B9F18D',
];
const rooms = ['rooms.10'];

const getRandomElement = (list) =>
  list[Math.floor(Math.random() * list.length)];

const getRandomRoom = () => getRandomElement(rooms);
const getRandomColor = () => getRandomElement(colors);

const room = getRandomRoom();

const ydoc = new Y.Doc();
const websocketProvider = new WebsocketProvider(
  'ws://127.0.0.1:8000',
  room,
  ydoc
);

const getInitialColor = () => {
  return JSON.parse(localStorage.getItem('currentColor')) || getRandomColor();
};

const Tiptap = ({ className, user }: Props) => {
  const [status, setStatus] = useState('connecting');
  const [currentUser] = useState({
    name: user,
    color: getInitialColor(),
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Highlight,
      TaskList,
      TaskItem,
      CharacterCount.configure({
        limit: 10000,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: websocketProvider,
        user: currentUser,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion,
      }),
    ],
    autofocus: 'end',
  });

  useEffect(() => {
    // Store shared data persistently in browser to make offline editing possible
    const indexeddbProvider = new IndexeddbPersistence(room, ydoc);

    indexeddbProvider.on('synced', () => {
      console.log('Loaded content from database …');
    });

    // Update status changes
    websocketProvider.on('status', (event) => {
      setStatus(event.status);
    });
  }, []);

  // Save current user to localStorage and emit to editor
  useEffect(() => {
    if (editor && currentUser) {
      localStorage.setItem('currentColor', JSON.stringify(currentUser.color));
    }
  }, [editor, currentUser]);

  return (
    <div className={className || ''}>
      <div className="editor">
        {editor && <MenuBar editor={editor} />}
        <EditorContent
          className="editor__content prose-sm leading-none"
          editor={editor}
          onClick={() => {
            editor.commands.focus();
          }}
        />
        <div className="editor__footer">
          <div className={`editor__status editor__status--${status}`}>
            {status === 'connected' ? 'online' : 'offline'}
          </div>
          <div className="editor__name">
            <button>{currentUser.name}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tiptap;
