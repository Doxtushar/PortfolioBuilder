import { useState, useEffect } from 'react';
import type { CreateProjectInput, Project } from '../types/project.js';
import './project-form.css';

type ProjectFormProps = {
  project: Project | null;
  onClose: () => void;
  onSubmit: (input: CreateProjectInput) => void;
  isSubmitting: boolean;
};

export function ProjectForm({ project, onClose, onSubmit, isSubmitting }: ProjectFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description || '');
      setTechnologies(project.technologies || '');
      setProjectUrl(project.projectUrl || '');
      setGithubUrl(project.githubUrl || '');
      setImageUrl(project.imageUrl || '');
    } else {
      setTitle('');
      setDescription('');
      setTechnologies('');
      setProjectUrl('');
      setGithubUrl('');
      setImageUrl('');
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const input: CreateProjectInput = {
      title: title.trim(),
    };

    if (description.trim()) {
      input.description = description.trim();
    }
    if (technologies.trim()) {
      input.technologies = technologies.trim();
    }
    if (projectUrl.trim()) {
      input.projectUrl = projectUrl.trim();
    }
    if (githubUrl.trim()) {
      input.githubUrl = githubUrl.trim();
    }
    if (imageUrl.trim()) {
      input.imageUrl = imageUrl.trim();
    }

    onSubmit(input);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="project-form-modal modal" onClick={(e) => e.stopPropagation()}>
        <div className="project-form-header modal-header">
          <h2>{project ? 'Edit Project' : 'Add Project'}</h2>
          <button
            type="button"
            className="project-form-close modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form className="project-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="project-title">Title *</label>
            <input
              id="project-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="project-description">Description</label>
            <textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="project-technologies">Technologies (comma-separated)</label>
            <input
              id="project-technologies"
              type="text"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="React, TypeScript, Node.js"
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="project-url">Project URL</label>
            <input
              id="project-url"
              type="url"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="github-url">GitHub URL</label>
            <input
              id="github-url"
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/user/repo"
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="image-url">Image URL</label>
            <input
              id="image-url"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={isSubmitting}
            />
          </div>
          <div className="project-form-actions modal-actions">
            <button
              type="button"
              className="modal-button modal-button-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-button modal-button-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving…' : project ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
