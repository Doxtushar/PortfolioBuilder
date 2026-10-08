import { useState, useEffect } from 'react';
import type { CreateExperienceInput, Experience } from '../types/experience.js';

interface ExperienceFormProps {
  experience: Experience | null;
  onClose: () => void;
  onSubmit: (input: CreateExperienceInput) => void;
  isSubmitting: boolean;
}

export function ExperienceForm({ experience, onClose, onSubmit, isSubmitting }: ExperienceFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (experience) {
      setCompanyName(experience.companyName);
      setJobTitle(experience.jobTitle);
      setEmploymentType(experience.employmentType || '');
      setLocation(experience.location || '');
      setStartDate(experience.startDate);
      setEndDate(experience.endDate || '');
      setIsCurrent(experience.isCurrent);
      setDescription(experience.description || '');
    } else {
      setCompanyName('');
      setJobTitle('');
      setEmploymentType('');
      setLocation('');
      setStartDate('');
      setEndDate('');
      setIsCurrent(false);
      setDescription('');
    }
  }, [experience]);

  useEffect(() => {
    if (isCurrent) {
      setEndDate('');
    }
  }, [isCurrent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const input: CreateExperienceInput = {
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim(),
      startDate: startDate,
    };

    if (employmentType.trim()) {
      input.employmentType = employmentType.trim();
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

    onSubmit(input);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{experience ? 'Edit Experience' : 'Add Experience'}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="experience-company">Company Name *</label>
            <input
              id="experience-company"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="experience-job-title">Job Title *</label>
            <input
              id="experience-job-title"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="experience-employment-type">Employment Type</label>
            <input
              id="experience-employment-type"
              type="text"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g., Full-time, Part-time, Contract"
            />
          </div>
          <div className="form-group">
            <label htmlFor="experience-location">Location</label>
            <input
              id="experience-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g., San Francisco, CA"
            />
          </div>
          <div className="form-group">
            <label htmlFor="experience-start-date">Start Date *</label>
            <input
              id="experience-start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="experience-end-date">End Date</label>
            <input
              id="experience-end-date"
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
              <span>Currently working here</span>
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="experience-description">Description</label>
            <textarea
              id="experience-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              placeholder="Describe your responsibilities and achievements..."
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
            disabled={isSubmitting || !companyName.trim() || !jobTitle.trim() || !startDate}
          >
            {isSubmitting ? 'Saving…' : experience ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
