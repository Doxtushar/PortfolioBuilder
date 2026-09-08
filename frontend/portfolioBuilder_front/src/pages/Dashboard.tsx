import { BriefcaseBusiness, LogOut, Plus, UserRound, Edit, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { portfolioApi } from '../services/portfolio-api.js';
import { PortfolioForm } from '../components/PortfolioForm.js';
import { useState } from 'react';
import './dashboard.css';

function getPortfolioErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    if (message) {
      return message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Failed to load portfolio.';
}

export function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);

  const {
    data: portfolio,
    isLoading: isPortfolioLoading,
    isError: isPortfolioError,
    error: portfolioError,
    refetch,
  } = useQuery({
    queryKey: ['portfolio'],
    queryFn: portfolioApi.getPortfolio,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const portfolioErrorMessage = getPortfolioErrorMessage(portfolioError);

  return (
    <div className="dashboard-shell">
      <header className="dashboard-navbar">
        <a className="dashboard-brand" href="/dashboard" aria-label="PortfolioBuilder dashboard">
          <span className="dashboard-brand-mark" aria-hidden="true">
            <BriefcaseBusiness size={20} />
          </span>
          <span>PortfolioBuilder</span>
        </a>

        <div className="dashboard-account">
          <span className="dashboard-avatar" aria-hidden="true">
            <UserRound size={18} />
          </span>
          <div className="dashboard-user-details">
            <span className="dashboard-user-name">{user?.name}</span>
            <span className="dashboard-user-email">{user?.email}</span>
          </div>
          <button type="button" className="dashboard-logout" onClick={handleLogout}>
            <LogOut size={17} aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-welcome" aria-labelledby="dashboard-title">
          <p className="dashboard-eyebrow">Your workspace</p>
          <h1 id="dashboard-title">Welcome back, {user?.name}.</h1>
          <p>Build a professional portfolio that brings your work into focus.</p>
        </section>

        <section className="portfolio-section" aria-labelledby="portfolio-section-title">
          <div className="portfolio-section-heading">
            <div>
              <h2 id="portfolio-section-title">My Portfolio</h2>
              <p>
                {portfolio
                  ? 'Your portfolio overview.'
                  : 'Your portfolio will appear here when you are ready to create it.'}
              </p>
            </div>
            {!portfolio && !isPortfolioLoading && !isPortfolioError && (
              <button type="button" className="create-portfolio-button" onClick={() => setShowPortfolioForm(true)}>
                <Plus size={18} aria-hidden="true" />
                Create Portfolio
              </button>
            )}
            {portfolio && !isPortfolioLoading && !isPortfolioError && (
              <button type="button" className="create-portfolio-button" onClick={() => setShowPortfolioForm(true)}>
                <Edit size={18} aria-hidden="true" />
                Edit Portfolio
              </button>
            )}
          </div>

          {isPortfolioLoading && (
            <div className="portfolio-status-state" role="status" aria-live="polite">
              <p>Loading your portfolio…</p>
            </div>
          )}

          {isPortfolioError && (
            <div className="portfolio-status-state portfolio-error-state" role="alert">
              <h3>Could not load portfolio</h3>
              <p>{portfolioErrorMessage}</p>
              <button type="button" className="portfolio-retry-button" onClick={() => refetch()}>
                Try again
              </button>
            </div>
          )}

          {!isPortfolioLoading && !isPortfolioError && portfolio === null && (
            <div className="portfolio-empty-state">
              <span className="portfolio-empty-icon" aria-hidden="true">
                <BriefcaseBusiness size={28} />
              </span>
              <h3>Create your portfolio</h3>
              <p>Create your first portfolio to showcase your experience, projects, and skills.</p>
            </div>
          )}

          {!isPortfolioLoading && !isPortfolioError && portfolio && (
            <div className="portfolio-profile-card">
              <div className="profile-header">
                {portfolio.profileImageUrl ? (
                  <img
                    src={portfolio.profileImageUrl}
                    alt={`${portfolio.fullName || portfolio.username} profile`}
                    className="profile-avatar"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) {
                        fallback.classList.remove('hidden');
                      }
                    }}
                  />
                ) : (
                  <div className="profile-avatar-fallback">
                    <UserRound size={32} />
                  </div>
                )}
                {portfolio.profileImageUrl && (
                  <div className="profile-avatar-fallback hidden">
                    <UserRound size={32} />
                  </div>
                )}
                <div className="profile-info">
                  {portfolio.fullName && <h3 className="profile-name">{portfolio.fullName}</h3>}
                  {portfolio.headline && <p className="profile-headline">{portfolio.headline}</p>}
                  <div className="profile-meta">
                    <span className="profile-username">@{portfolio.username}</span>
                    {portfolio.location && (
                      <span className="profile-location">
                        <MapPin size={14} />
                        {portfolio.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {(portfolio.introduction || portfolio.bio) && (
                <div className="profile-body">
                  {portfolio.introduction && (
                    <div className="profile-section">
                      <h4 className="profile-section-title">Introduction</h4>
                      <p className="profile-section-content">{portfolio.introduction}</p>
                    </div>
                  )}
                  {portfolio.bio && (
                    <div className="profile-section">
                      <h4 className="profile-section-title">Bio</h4>
                      <p className="profile-section-content">{portfolio.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {showPortfolioForm && (
        <PortfolioForm portfolio={portfolio ?? null} onClose={() => setShowPortfolioForm(false)} />
      )}
    </div>
  );
}
