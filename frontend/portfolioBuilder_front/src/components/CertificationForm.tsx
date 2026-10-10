import { useState, useEffect } from 'react';
import type { CreateCertificationInput, Certification } from '../types/certification.js';

interface CertificationFormProps {
  certification: Certification | null;
  onClose: () => void;
  onSubmit: (input: CreateCertificationInput) => void;
  isSubmitting: boolean;
}

export function CertificationForm({ certification, onClose, onSubmit, isSubmitting }: CertificationFormProps) {
  const [name, setName] = useState('');
  const [issuingOrganization, setIssuingOrganization] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);

  useEffect(() => {
    if (certification) {
      setName(certification.name);
      setIssuingOrganization(certification.issuingOrganization);
      setIssueDate(certification.issueDate || '');
      setExpirationDate(certification.expirationDate || '');
      setCredentialId(certification.credentialId || '');
      setCredentialUrl(certification.credentialUrl || '');
      setDescription(certification.description || '');
      setDisplayOrder(certification.displayOrder);
    } else {
      setName('');
      setIssuingOrganization('');
      setIssueDate('');
      setExpirationDate('');
      setCredentialId('');
      setCredentialUrl('');
      setDescription('');
      setDisplayOrder(0);
    }
  }, [certification]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const input: CreateCertificationInput = {
      name: name.trim(),
      issuingOrganization: issuingOrganization.trim(),
    };

    if (issueDate) {
      input.issueDate = issueDate;
    }

    if (expirationDate) {
      input.expirationDate = expirationDate;
    }

    if (credentialId.trim()) {
      input.credentialId = credentialId.trim();
    }

    if (credentialUrl.trim()) {
      input.credentialUrl = credentialUrl.trim();
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
          <h3>{certification ? 'Edit Certification' : 'Add Certification'}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="certification-name">Certification Name *</label>
            <input
              id="certification-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              required
              placeholder="e.g., AWS Certified Solutions Architect"
            />
          </div>
          <div className="form-group">
            <label htmlFor="certification-organization">Issuing Organization *</label>
            <input
              id="certification-organization"
              type="text"
              value={issuingOrganization}
              onChange={(e) => setIssuingOrganization(e.target.value)}
              disabled={isSubmitting}
              required
              placeholder="e.g., Amazon Web Services"
            />
          </div>
          <div className="form-group">
            <label htmlFor="certification-issue-date">Issue Date</label>
            <input
              id="certification-issue-date"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="certification-expiration-date">Expiration Date</label>
            <input
              id="certification-expiration-date"
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              disabled={isSubmitting}
              min={issueDate}
            />
          </div>
          <div className="form-group">
            <label htmlFor="certification-credential-id">Credential ID</label>
            <input
              id="certification-credential-id"
              type="text"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g., AWS-ASA-12345"
            />
          </div>
          <div className="form-group">
            <label htmlFor="certification-credential-url">Credential URL</label>
            <input
              id="certification-credential-url"
              type="url"
              value={credentialUrl}
              onChange={(e) => setCredentialUrl(e.target.value)}
              disabled={isSubmitting}
              placeholder="https://example.com/verify"
            />
          </div>
          <div className="form-group">
            <label htmlFor="certification-description">Description</label>
            <textarea
              id="certification-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              placeholder="Describe your certification..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="certification-display-order">Display Order</label>
            <input
              id="certification-display-order"
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
            disabled={isSubmitting || !name.trim() || !issuingOrganization.trim()}
          >
            {isSubmitting ? 'Saving…' : certification ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
