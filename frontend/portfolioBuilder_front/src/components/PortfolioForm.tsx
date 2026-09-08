import { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { portfolioApi, type PortfolioInput } from '../services/portfolio-api.js';
import type { Portfolio } from '../types/portfolio.js';
import './portfolio-form.css';

interface PortfolioFormProps {
  portfolio: Portfolio | null;
  onClose: () => void;
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    if (message) {
      return message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Failed to save portfolio.';
}

export function PortfolioForm({ portfolio, onClose }: PortfolioFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!portfolio;

  const [username, setUsername] = useState(portfolio?.username || '');
  const [title, setTitle] = useState(portfolio?.title || '');
  const [bio, setBio] = useState(portfolio?.bio || '');
  const [fullName, setFullName] = useState(portfolio?.fullName || '');
  const [headline, setHeadline] = useState(portfolio?.headline || '');
  const [location, setLocation] = useState(portfolio?.location || '');
  const [introduction, setIntroduction] = useState(portfolio?.introduction || '');
  const [profileImageUrl, setProfileImageUrl] = useState(portfolio?.profileImageUrl || '');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (portfolio) {
      setUsername(portfolio.username);
      setTitle(portfolio.title);
      setBio(portfolio.bio || '');
      setFullName(portfolio.fullName || '');
      setHeadline(portfolio.headline || '');
      setLocation(portfolio.location || '');
      setIntroduction(portfolio.introduction || '');
      setProfileImageUrl(portfolio.profileImageUrl || '');
    } else {
      setUsername('');
      setTitle('');
      setBio('');
      setFullName('');
      setHeadline('');
      setLocation('');
      setIntroduction('');
      setProfileImageUrl('');
    }
  }, [portfolio]);

  const createMutation = useMutation({
    mutationFn: (input: PortfolioInput) => portfolioApi.createPortfolio(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      onClose();
    },
    onError: (error) => {
      setFormError(getErrorMessage(error));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (input: PortfolioInput) => portfolioApi.updatePortfolio(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      onClose();
    },
    onError: (error) => {
      setFormError(getErrorMessage(error));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!username.trim()) {
      setFormError('Username is required');
      return;
    }

    if (!title.trim()) {
      setFormError('Title is required');
      return;
    }

    const input: PortfolioInput = {
      username: username.trim(),
      title: title.trim(),
      bio: bio.trim() || null,
    };

    if (fullName.trim()) {
      input.fullName = fullName.trim();
    }
    if (headline.trim()) {
      input.headline = headline.trim();
    }
    if (location.trim()) {
      input.location = location.trim();
    }
    if (introduction.trim()) {
      input.introduction = introduction.trim();
    }
    if (profileImageUrl.trim()) {
      input.profileImageUrl = profileImageUrl.trim();
    }

    if (isEditing) {
      await updateMutation.mutateAsync(input);
    } else {
      await createMutation.mutateAsync(input);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="portfolio-form-overlay">
      <div className="portfolio-form-modal">
        <div className="portfolio-form-header">
          <h2>{isEditing ? 'Edit Portfolio' : 'Create Portfolio'}</h2>
          <button type="button" className="portfolio-form-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="portfolio-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your-username"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Portfolio"
              disabled={isLoading}
              autoComplete="organization-title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell visitors about yourself..."
              disabled={isLoading}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              disabled={isLoading}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="headline">Professional Headline</label>
            <input
              id="headline"
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Software Developer"
              disabled={isLoading}
              autoComplete="organization-title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="San Francisco, CA"
              disabled={isLoading}
              autoComplete="address-level2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="introduction">Introduction</label>
            <textarea
              id="introduction"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="A brief introduction about your professional background..."
              disabled={isLoading}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="profileImageUrl">Profile Image URL</label>
            <input
              id="profileImageUrl"
              type="url"
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
              placeholder="https://example.com/profile.jpg"
              disabled={isLoading}
              autoComplete="photo"
            />
          </div>

          {formError && <div className="portfolio-form-error">{formError}</div>}

          <div className="portfolio-form-actions">
            <button type="button" className="portfolio-form-cancel" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="portfolio-form-submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="spinner" size={18} /> : isEditing ? 'Save Changes' : 'Create Portfolio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
