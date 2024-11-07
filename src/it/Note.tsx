import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/layout/Layout/Layout'

interface Note {
  id: string;
  text: string;
  canvasData: string | null;
  canvasOptions: {
    color: string;
    lineWidth: number;
  };
  createdAt: Date;
}

const NoteApp: React.FC = () => {
  // ... (rest of the code remains the same)
  const [notes, setNotes] = useState<Note[]>(() => {
    const storedNotes = localStorage.getItem('notes');
    return storedNotes ? JSON.parse(storedNotes) : [];
  });
  const [newNote, setNewNote] = useState('');
  const [canvasMode, setCanvasMode] = useState(false);
  const [isDrawingExpanded, setIsDrawingExpanded] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [canvasOptions, setCanvasOptions] = useState<{ color: string; lineWidth: number }>({
    color: '#000000',
    lineWidth: 2,
  });

  useEffect(() => {
    if (editingNoteId !== null) {
      const editingNote = notes.find((note) => note.id === editingNoteId);
      if (editingNote) {
        setCanvasOptions(editingNote.canvasOptions);
        if (canvasRef.current && editingNote.canvasData) {
          const img = new Image();
          img.src = editingNote.canvasData;
          img.onload = () => {
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
              }
            }
          };
        }
      }
    }
  }, [editingNoteId, notes]);

  const generateId = (): string => {
    return (
      (Math.random().toString(36).substring(2, 10) +
        Math.random().toString(36).substring(2, 10))
        .slice(0, 10)
    );
  };

  const addNote = () => {
    if (newNote.trim() !== '') {
      const canvas = canvasRef.current;
      let canvasData = null;
      if (canvas) {
        canvasData = canvas.toDataURL();
      }
      const newNoteItem: Note = {
        id: generateId(),
        text: newNote,
        canvasData,
        canvasOptions: { ...canvasOptions },
        createdAt: new Date(),
      };
      setNotes([...notes, newNoteItem]);
      setNewNote('');
      setCanvasMode(false);
      saveNotesToLocalStorage([...notes, newNoteItem]);
    }
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    saveNotesToLocalStorage(updatedNotes);
  };

  const toggleCanvasMode = () => {
    if (canvasMode) {
      const canvas = canvasRef.current;
      if (canvas) {
        const dataURL = canvas.toDataURL();
        const updatedNotes = editingNoteId
          ? notes.map((note) =>
              note.id === editingNoteId
                ? { ...note, canvasData: dataURL, canvasOptions: { ...canvasOptions } }
                : note
            )
          : [...notes, { id: generateId(), text: '', canvasData: dataURL, canvasOptions: { ...canvasOptions }, createdAt: new Date() }];
        setNotes(updatedNotes);
        saveNotesToLocalStorage(updatedNotes);
        setEditingNoteId(null);
      }
    } else {
      clearCanvas();
    }
    setCanvasMode((prev) => !prev);
  };

  const toggleDrawingExpansion = () => {
    setIsDrawingExpanded((prev) => !prev);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleDrawingStart = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      if (e.type === 'touchstart') {
        const touch = (e as React.TouchEvent<HTMLCanvasElement>).touches[0];
        setLastPos({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
      } else {
        setLastPos({ x: (e as React.MouseEvent<HTMLCanvasElement, MouseEvent>).clientX - rect.left, y: (e as React.MouseEvent<HTMLCanvasElement, MouseEvent>).clientY - rect.top });
      }
    }
  };

  const handleDrawingEnd = () => {
    setIsDrawing(false);
    setLastPos(null);
  };

  const handleDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPos) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      let x, y;
      if (e.type === 'touchmove') {
        const touch = (e as React.TouchEvent<HTMLCanvasElement>).touches[0];
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      } else {
        x = (e as React.MouseEvent<HTMLCanvasElement, MouseEvent>).clientX - rect.left;
        y = (e as React.MouseEvent<HTMLCanvasElement, MouseEvent>).clientY - rect.top;
      }
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = canvasOptions.color;
        ctx.lineWidth = canvasOptions.lineWidth;
        ctx.stroke();
        setLastPos({ x, y });
      }
    }
  };

  const handleCanvasOptionChange = (option: 'color' | 'lineWidth', value: string | number) => {
    setCanvasOptions((prevOptions) => ({
      ...prevOptions,
      [option]: value,
    }));
  };

  const handleNoteEdit = (noteId: string) => {
    setEditingNoteId(noteId);
    setCanvasMode(true);
  };

  const handleNoteUpdate = (noteId: string, newText: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, text: newText } : note
    );
    setNotes(updatedNotes);
    saveNotesToLocalStorage(updatedNotes);
    setEditingNoteId(null);
    setCanvasMode(false);
  };

  const saveNotesToLocalStorage = (notes: Note[]) => {
    localStorage.setItem('notes', JSON.stringify(notes));
  };

  const [isScrollLocked, setIsScrollLocked] = useState(false);

  const handleDrawingStart = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsScrollLocked(true);
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      if (e.type === 'touchstart') {
        const touch = (e as React.TouchEvent<HTMLCanvasElement>).touches[0];
        setLastPos({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
      } else {
        setLastPos({ x: (e as React.MouseEvent<HTMLCanvasElement, MouseEvent>).clientX - rect.left, y: (e as React.MouseEvent<HTMLCanvasElement, MouseEvent>).clientY - rect.top });
      }
    }
  };

  const handleDrawingEnd = () => {
    setIsScrollLocked(false);
    setIsDrawing(false);
    setLastPos(null);
  };

  const handleDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPos) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      let x, y;
      if (e.type === 'touchmove') {
        const touch = (e as React.TouchEvent<HTMLCanvasElement>).touches[0];
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      } else {
        x = (e as React.MouseEvent<HTMLCanvasElement, MouseEvent>).clientX - rect.left;
        y = (e as React.MouseEvent<HTMLCanvasElement, MouseEvent>).clientY - rect.top;
      }
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = canvasOptions.color;
        ctx.lineWidth = canvasOptions.lineWidth;
        ctx.stroke();
        setLastPos({ x, y });
      }
    }
  };

  return (
    <Layout title='Note'>
    <div className={`flex flex-col items-center justify-center h-screen p-4 md:p-8 ${canvasMode ? 'fixed top-0 left-0 w-full h-full bg-white z-50' : ''}`}>
      {canvasMode && (
        <div className="w-full h-full relative">
          <canvas
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            className="border-none"
            onMouseDown={handleDrawingStart}
            onMouseUp={handleDrawingEnd}
            onMouseMove={handleDrawing}
            onTouchStart={handleDrawingStart}
            onTouchMove={handleDrawing}
            onTouchEnd={handleDrawingEnd}
            style={{ zIndex: 10 }}
          />
          <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-white p-2 rounded-md shadow-md">
            <button
              onClick={toggleDrawingExpansion}
              className={`bg-blue-500 hover:bg-blue-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDrawingExpanded ? 'bg-blue-600' : ''}`}
            >
              {isDrawingExpanded ? 'Hide Drawing Tools' : 'Show Drawing Tools'}
            </button>
            {isDrawingExpanded && (
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={canvasOptions.color}
                  onChange={(e) => handleCanvasOptionChange('color', e.target.value)}
                  className="w-8 h-8 border-none cursor-pointer"
                />
                <select
                  value={canvasOptions.lineWidth}
                  onChange={(e) => handleCanvasOptionChange('lineWidth', parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={2}>2px</option>
                  <option value={4}>4px</option>
                  <option value={6}>6px</option>
                  <option value={8}>8px</option>
                </select>
                <button
                  onClick={clearCanvas}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsScrollLocked((prev) => !prev)}
                  className={`bg-gray-500 hover:bg-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 ${isScrollLocked ? 'bg-gray-600' : ''}`}
                >
                  {isScrollLocked ? 'Unlock Scroll' : 'Lock Scroll'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ... (rest of the code remains the same) */}

    </div>
    </Layout>
  );
};

export default NoteApp;