import { useState, useEffect } from 'react';
import type { CreateEducationInput, Education } from '../types/education.js';

interface EducationFormProps {
  education: Education | null;
  onClose: () => void;
  onSubmit: (input: CreateEducationInput) => void;
  isSubmitting: boolean;
}

export function EducationForm({ education, onClose, onSubmit, isSubmitting }: EducationFormProps) {
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);

  useEffect(() => {
    if (education) {
      setInstitution(education.institution);
      setDegree(education.degree);
      setFieldOfStudy(education.fieldOfStudy || '');
      setLocation(education.location || '');
      setStartDate(education.startDate);
      setEndDate(education.endDate || '');
      setIsCurrent(education.isCurrent);
      setDescription(education.description || '');
      setDisplayOrder(education.displayOrder);
    } else {
      setInstitution('');
      setDegree('');
      setFieldOfStudy('');
      setLocation('');
      setStartDate('');
      setEndDate('');
      setIsCurrent(false);
      setDescription('');
      setDisplayOrder(0);
    }
  }, [education]);

  useEffect(() => {
    if (isCurrent) {
      setEndDate('');
    }
  }, [isCurrent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const input: CreateEducationInput = {
      institution: institution.trim(),
      degree: degree.trim(),
      startDate: startDate,
    };

    if (fieldOfStudy.trim()) {
      input.fieldOfStudy = fieldOfStudy.trim();
    }

    if (location.trim()) {
      input.location = location.trim();
    }

    if (endDate && !isCurrent) {
      input.endDate = endDate;
    }

    if (isCurrent) {
      input.isCurrent = true;
    }

    if (description.trim()) {
      input.description = description.trim();
    }

    input.displayOrder = displayOrder;

    onSubmit(input);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{education ? 'Edit Education' : 'Add Education'}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="education-institution">Institution *</label>
            <input
              id="education-institution"
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="education-degree">Degree *</label>
            <input
              id="education-degree"
              type="text"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="education-field-of-study">Field of Study</label>
            <input
              id="education-field-of-study"
              type="text"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g., Computer Science"
            />
          </div>
          <div className="form-group">
            <label htmlFor="education-location">Location</label>
            <input
              id="education-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g., Stanford, CA"
            />
          </div>
          <div className="form-group">
            <label htmlFor="education-start-date">Start Date *</label>
            <input
              id="education-start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="education-end-date">End Date</label>
            <input
              id="education-end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isSubmitting || isCurrent}
              min={startDate}
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                disabled={isSubmitting}
              />
              <span>Currently studying here</span>
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="education-description">Description</label>
            <textarea
              id="education-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              placeholder="Describe your academic achievements..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="education-display-order">Display Order</label>
            <input
              id="education-display-order"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              disabled={isSubmitting}
              min={0}
            />
          </div>
        </form>
        <div className="modal-actions">
          <button type="button" className="modal-button modal-button-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="submit"
            className="modal-button modal-button-primary"
            onClick={handleSubmit}
            disabled={isSubmitting || !institution.trim() || !degree.trim() || !startDate}
          >
            {isSubmitting ? 'Saving…' : education ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
