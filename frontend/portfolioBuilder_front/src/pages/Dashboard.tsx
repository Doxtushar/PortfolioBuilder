import { BriefcaseBusiness, LogOut, Plus, UserRound, Edit, MapPin, Trash2, ExternalLink, Link } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { portfolioApi } from '../services/portfolio-api.js';
import { projectApi } from '../services/project-api.js';
import { PortfolioForm } from '../components/PortfolioForm.js';
import { ProjectForm } from '../components/ProjectForm.js';
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
  const queryClient = useQueryClient();
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [deleteConfirmProject, setDeleteConfirmProject] = useState<string | null>(null);

  const {
    data: portfolio,
    isLoading: isPortfolioLoading,
    isError: isPortfolioError,
    error: portfolioError,
    refetch: refetchPortfolio,
  } = useQuery({
    queryKey: ['portfolio'],
    queryFn: portfolioApi.getPortfolio,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const {
    data: projects = [],
    isLoading: isProjectsLoading,
    isError: isProjectsError,
    error: projectsError,
    refetch: refetchProjects,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getProjects,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!portfolio,
  });

  const createProjectMutation = useMutation({
    mutationFn: projectApi.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowProjectForm(false);
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof projectApi.updateProject>[1] }) =>
      projectApi.updateProject(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowProjectForm(false);
      setEditingProject(null);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: projectApi.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setDeleteConfirmProject(null);
    },
  });

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const portfolioErrorMessage = getPortfolioErrorMessage(portfolioError);
  const projectsErrorMessage = getPortfolioErrorMessage(projectsError);

  const handleAddProject = () => {
    setEditingProject(null);
    setShowProjectForm(true);
  };

  const handleEditProject = (projectId: string) => {
    setEditingProject(projectId);
    setShowProjectForm(true);
  };

  const handleDeleteProject = (projectId: string) => {
    setDeleteConfirmProject(projectId);
  };

  const confirmDeleteProject = () => {
    if (deleteConfirmProject) {
      deleteProjectMutation.mutate(deleteConfirmProject);
    }
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
              <button type="button" className="portfolio-retry-button" onClick={() => refetchPortfolio()}>
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

        {portfolio && (
          <section className="portfolio-section" aria-labelledby="projects-section-title">
            <div className="portfolio-section-heading">
              <div>
                <h2 id="projects-section-title">Projects</h2>
                <p>Showcase your work and achievements.</p>
              </div>
              <button
                type="button"
                className="create-portfolio-button"
                onClick={handleAddProject}
                disabled={isProjectsLoading}
              >
                <Plus size={18} aria-hidden="true" />
                Add Project
              </button>
            </div>

            {isProjectsLoading && (
              <div className="portfolio-status-state" role="status" aria-live="polite">
                <p>Loading projects…</p>
              </div>
            )}

            {isProjectsError && (
              <div className="portfolio-status-state portfolio-error-state" role="alert">
                <h3>Could not load projects</h3>
                <p>{projectsErrorMessage}</p>
                <button type="button" className="portfolio-retry-button" onClick={() => refetchProjects()}>
                  Try again
                </button>
              </div>
            )}

            {!isProjectsLoading && !isProjectsError && projects.length === 0 && (
              <div className="portfolio-empty-state">
                <span className="portfolio-empty-icon" aria-hidden="true">
                  <BriefcaseBusiness size={28} />
                </span>
                <h3>No projects yet</h3>
                <p>Add your first project to showcase your work.</p>
              </div>
            )}

            {!isProjectsLoading && !isProjectsError && projects.length > 0 && (
              <div className="projects-list">
                {projects.map((project) => (
                  <div key={project.id} className="project-card">
                    <div className="project-header">
                      <h3 className="project-title">{project.title}</h3>
                      <div className="project-actions">
                        <button
                          type="button"
                          className="project-action-button"
                          onClick={() => handleEditProject(project.id)}
                          aria-label={`Edit ${project.title}`}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          className="project-action-button project-delete-button"
                          onClick={() => handleDeleteProject(project.id)}
                          aria-label={`Delete ${project.title}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {project.description && <p className="project-description">{project.description}</p>}
                    {project.technologies && (
                      <div className="project-technologies">
                        {project.technologies.split(',').map((tech, index) => (
                          <span key={index} className="project-tech-tag">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="project-links">
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                        >
                          <ExternalLink size={14} />
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                        >
                          <Link size={14} />
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {showPortfolioForm && (
        <PortfolioForm portfolio={portfolio ?? null} onClose={() => setShowPortfolioForm(false)} />
      )}

      {showProjectForm && (
        <ProjectForm
          project={editingProject ? projects.find((p) => p.id === editingProject) || null : null}
          onClose={() => {
            setShowProjectForm(false);
            setEditingProject(null);
          }}
          onSubmit={(input) => {
            if (editingProject) {
              updateProjectMutation.mutate({ id: editingProject, input });
            } else {
              createProjectMutation.mutate(input);
            }
          }}
          isSubmitting={createProjectMutation.isPending || updateProjectMutation.isPending}
        />
      )}

      {deleteConfirmProject && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmProject(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Project</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setDeleteConfirmProject(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this project? This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-button modal-button-secondary"
                onClick={() => setDeleteConfirmProject(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-button modal-button-danger"
                onClick={confirmDeleteProject}
                disabled={deleteProjectMutation.isPending}
              >
                {deleteProjectMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
