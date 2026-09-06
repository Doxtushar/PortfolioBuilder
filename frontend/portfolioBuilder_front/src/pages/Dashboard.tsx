import { BriefcaseBusiness, LogOut, Plus, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './dashboard.css';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

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
              <p>Your portfolio will appear here when you are ready to create it.</p>
            </div>
            <button type="button" className="create-portfolio-button" disabled>
              <Plus size={18} aria-hidden="true" />
              Create Portfolio
            </button>
          </div>

          <div className="portfolio-empty-state">
            <span className="portfolio-empty-icon" aria-hidden="true">
              <BriefcaseBusiness size={28} />
            </span>
            <h3>No portfolio yet</h3>
            <p>Create your first portfolio to showcase your experience, projects, and skills.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
