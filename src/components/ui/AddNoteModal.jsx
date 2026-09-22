import React, { useState } from 'react';
import { X, StickyNote } from 'lucide-react';

/**
 * Add Note modal.
 * Props:
 *   isOpen    – boolean
 *   onClose   – fn()
 *   onSubmit  – fn(noteText)
 */
export default function AddNoteModal({ isOpen, onClose, onSubmit }) {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText('');
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="note-modal-overlay" onClick={handleOverlayClick}>
      <div className="note-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="note-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <StickyNote size={18} color="var(--primary)" />
            <span className="note-modal-title">Add a Note</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="note-modal-body">
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Add an internal note about this opportunity. It will be recorded in the audit trail.
          </p>
          <textarea
            className="note-textarea"
            placeholder="Type your note here…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="note-modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!text.trim()}
            style={{ opacity: text.trim() ? 1 : 0.5 }}
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
