import { useState, useEffect } from 'react';
import type { CreateSkillInput, Skill } from '../types/skill.js';

interface SkillFormProps {
  skill: Skill | null;
  onClose: () => void;
  onSubmit: (input: CreateSkillInput) => void;
  isSubmitting: boolean;
}

export function SkillForm({ skill, onClose, onSubmit, isSubmitting }: SkillFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [proficiency, setProficiency] = useState<number | ''>('');
  const [displayOrder, setDisplayOrder] = useState<number | ''>('');

  useEffect(() => {
    if (skill) {
      setName(skill.name);
      setCategory(skill.category);
      setProficiency(skill.proficiency ?? '');
      setDisplayOrder(skill.displayOrder);
    } else {
      setName('');
      setCategory('');
      setProficiency('');
      setDisplayOrder('');
    }
  }, [skill]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const input: CreateSkillInput = {
      name: name.trim(),
      category: category.trim(),
    };

    if (proficiency !== '') {
      input.proficiency = Number(proficiency);
    }

    if (displayOrder !== '') {
      input.displayOrder = Number(displayOrder);
    }

    onSubmit(input);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{skill ? 'Edit Skill' : 'Add Skill'}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="skill-name">Name *</label>
            <input
              id="skill-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="skill-category">Category *</label>
            <input
              id="skill-category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="skill-proficiency">Proficiency (0-100)</label>
            <input
              id="skill-proficiency"
              type="number"
              min="0"
              max="100"
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value === '' ? '' : Number(e.target.value))}
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="skill-display-order">Display Order</label>
            <input
              id="skill-display-order"
              type="number"
              min="0"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value === '' ? '' : Number(e.target.value))}
              disabled={isSubmitting}
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
            disabled={isSubmitting || !name.trim() || !category.trim()}
          >
            {isSubmitting ? 'Saving…' : skill ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
