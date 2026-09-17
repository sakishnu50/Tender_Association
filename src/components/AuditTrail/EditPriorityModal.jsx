// src/components/AuditTrail/EditPriorityModal.jsx
import React, { useState, useEffect } from 'react';
import { X, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { normalizePriorityCase } from '../../services/auditService';
import styles from './AuditTrail.module.css';

export default function EditPriorityModal({
  isOpen,
  onClose,
  opportunity,
  currentPriority,
  currentUser,
  onSave
}) {
  const normalizedCurrent = normalizePriorityCase(currentPriority || 'Medium');
  const [selectedPriority, setSelectedPriority] = useState(normalizedCurrent);

  useEffect(() => {
    if (isOpen) {
      setSelectedPriority(normalizePriorityCase(currentPriority || 'Medium'));
    }
  }, [isOpen, currentPriority]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !opportunity) return null;

  const isChanged = selectedPriority.toLowerCase() !== normalizedCurrent.toLowerCase();

  const handleSave = () => {
    onSave({
      opportunityId: opportunity.id || opportunity.opportunityId,
      opportunityName: opportunity.name || opportunity.opportunity || opportunity.title,
      previousPriority: normalizedCurrent,
      newPriority: selectedPriority,
      isChanged
    });
  };

  const priorityOptions = [
    { value: 'High', label: 'High', colorClass: styles.priorityHigh, desc: 'Critical tender with urgent deadline or high strategic match' },
    { value: 'Medium', label: 'Medium', colorClass: styles.priorityMedium, desc: 'Standard pipeline tender matching general qualifications' },
    { value: 'Low', label: 'Low', colorClass: styles.priorityLow, desc: 'Secondary priority or optional review' }
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div>
            <h3 id="modal-title" className={styles.modalTitle}>Edit Priority</h3>
            <p className={styles.modalSubtitle}>Adjust opportunity priority and generate an audit record.</p>
          </div>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Opportunity Context Box */}
        <div className={styles.modalContextBox}>
          <div className={styles.contextRow}>
            <span className={styles.contextLabel}>Opportunity ID:</span>
            <span className={styles.contextValueId}>{opportunity.id || opportunity.opportunityId}</span>
          </div>
          <div className={styles.contextRow}>
            <span className={styles.contextLabel}>Opportunity:</span>
            <span className={styles.contextValueName}>{opportunity.name || opportunity.opportunity || opportunity.title}</span>
          </div>
          <div className={styles.contextRow}>
            <span className={styles.contextLabel}>Current Priority:</span>
            <span className={`${styles.priorityBadge} ${
              normalizedCurrent === 'High' ? styles.priorityHigh :
              normalizedCurrent === 'Medium' ? styles.priorityMedium : styles.priorityLow
            }`}>
              {normalizedCurrent}
            </span>
          </div>
        </div>

        {/* Priority Radio Selection */}
        <div className={styles.modalBody}>
          <label className={styles.sectionHeading}>Select New Priority:</label>
          <div className={styles.priorityOptionsGrid}>
            {priorityOptions.map((opt) => {
              const isSelected = selectedPriority === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.priorityOptionCard} ${isSelected ? styles.priorityOptionSelected : ''}`}
                  onClick={() => setSelectedPriority(opt.value)}
                >
                  <div className={styles.optionHeader}>
                    <span className={`${styles.priorityBadge} ${opt.colorClass}`}>
                      {opt.label}
                    </span>
                    <span className={`${styles.optionRadio} ${isSelected ? styles.optionRadioChecked : ''}`}>
                      {isSelected && <span className={styles.radioDot} />}
                    </span>
                  </div>
                  <p className={styles.optionDescription}>{opt.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Dynamic Change Feedback */}
          {isChanged ? (
            <div className={styles.changePreviewBox}>
              <div className={styles.changePreviewHeader}>
                <CheckCircle2 size={16} className={styles.previewIcon} />
                <span>Audit entry will be logged:</span>
              </div>
              <div className={styles.changePreviewDetails}>
                <strong>Priority changed: {normalizedCurrent} <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {selectedPriority}</strong>
                <span className={styles.changePreviewMeta}>User: {currentUser || 'Admin'}</span>
              </div>
            </div>
          ) : (
            <div className={styles.unchangedNotice}>
              <ShieldAlert size={15} />
              <span>Selected priority matches current priority. No new audit log will be created.</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
