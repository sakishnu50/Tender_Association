import React from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

export function PursueModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700' }}>Pursue Opportunity</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Owner</label>
            <select style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <option>Ravi Kumar</option>
              <option>Arun Singh</option>
              <option>Priya Nair</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Priority</label>
            <select style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Department</label>
            <select style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <option>Infrastructure</option>
              <option>Transport</option>
              <option>Water</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Notes</label>
            <textarea
              rows={3}
              style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
              defaultValue="This project is highly aligned with our capabilities and past performance."
            />
          </div>

          <div style={{
            backgroundColor: 'var(--info-bg)',
            border: '1px solid var(--info)',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: 'var(--info-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle size={16} />
            <span>AI recommends pursuing: Technical capability match is 9.2/10.</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>CANCEL</button>
          <button className="btn btn-success" onClick={onConfirm}>CONFIRM</button>
        </div>
      </div>
    </div>
  );
}

export function DeclineModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700' }}>Decline Opportunity</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Reason</label>
            <select style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <option>Budget Constraints</option>
              <option>Capability Gap</option>
              <option>Resource Shortage</option>
              <option>Geographic Limitations</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Notes</label>
            <textarea
              rows={3}
              style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
              defaultValue="The project value is beyond our current budget capacity."
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>CANCEL</button>
          <button className="btn btn-danger" onClick={onConfirm}>CONFIRM</button>
        </div>
      </div>
    </div>
  );
}
