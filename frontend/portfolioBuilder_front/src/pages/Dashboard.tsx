import { BriefcaseBusiness, LogOut, Plus, UserRound, Edit, MapPin, Trash2, ExternalLink, Link, Zap, Building2, GraduationCap, Award } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { portfolioApi } from '../services/portfolio-api.js';
import { projectApi } from '../services/project-api.js';
import { skillApi } from '../services/skill-api.js';
import { experienceApi } from '../services/experience-api.js';
import { educationApi } from '../services/education-api.js';
import { certificationApi } from '../services/certification-api.js';
import { PortfolioForm } from '../components/PortfolioForm.js';
import { ProjectForm } from '../components/ProjectForm.js';
import { SkillForm } from '../components/SkillForm.js';
import { ExperienceForm } from '../components/ExperienceForm.js';
import { EducationForm } from '../components/EducationForm.js';
import { CertificationForm } from '../components/CertificationForm.js';
import { useState } from 'react';
import './dashboard.css';
import type { CreateSkillInput } from '../types/skill.js';
import type { CreateExperienceInput } from '../types/experience.js';
import type { CreateEducationInput } from '../types/education.js';
import type { CreateCertificationInput } from '../types/certification.js';

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
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [deleteConfirmSkill, setDeleteConfirmSkill] = useState<string | null>(null);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<string | null>(null);
  const [deleteConfirmExperience, setDeleteConfirmExperience] = useState<string | null>(null);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState<string | null>(null);
  const [deleteConfirmEducation, setDeleteConfirmEducation] = useState<string | null>(null);
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const [editingCertification, setEditingCertification] = useState<string | null>(null);
  const [deleteConfirmCertification, setDeleteConfirmCertification] = useState<string | null>(null);

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

  const {
    data: skills = [],
    isLoading: isSkillsLoading,
    isError: isSkillsError,
    error: skillsError,
    refetch: refetchSkills,
  } = useQuery({
    queryKey: ['skills'],
    queryFn: skillApi.getSkills,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!portfolio,
  });

  const {
    data: experiences = [],
    isLoading: isExperiencesLoading,
    isError: isExperiencesError,
    error: experiencesError,
    refetch: refetchExperiences,
  } = useQuery({
    queryKey: ['experiences'],
    queryFn: experienceApi.getExperiences,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!portfolio,
  });

  const {
    data: education = [],
    isLoading: isEducationLoading,
    isError: isEducationError,
    error: educationError,
    refetch: refetchEducation,
  } = useQuery({
    queryKey: ['education'],
    queryFn: educationApi.getEducation,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!portfolio,
  });

  const {
    data: certifications = [],
    isLoading: isCertificationsLoading,
    isError: isCertificationsError,
    error: certificationsError,
    refetch: refetchCertifications,
  } = useQuery({
    queryKey: ['certifications'],
    queryFn: certificationApi.getCertifications,
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

  const createSkillMutation = useMutation({
    mutationFn: skillApi.createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setShowSkillForm(false);
    },
  });

  const updateSkillMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof skillApi.updateSkill>[1] }) =>
      skillApi.updateSkill(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setShowSkillForm(false);
      setEditingSkill(null);
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: skillApi.deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setDeleteConfirmSkill(null);
    },
  });

  const createExperienceMutation = useMutation({
    mutationFn: experienceApi.createExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      setShowExperienceForm(false);
    },
  });

  const updateExperienceMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof experienceApi.updateExperience>[1] }) =>
      experienceApi.updateExperience(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      setShowExperienceForm(false);
      setEditingExperience(null);
    },
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: experienceApi.deleteExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      setDeleteConfirmExperience(null);
    },
  });

  const createEducationMutation = useMutation({
    mutationFn: educationApi.createEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      setShowEducationForm(false);
    },
  });

  const updateEducationMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof educationApi.updateEducation>[1] }) =>
      educationApi.updateEducation(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      setShowEducationForm(false);
      setEditingEducation(null);
    },
  });

  const deleteEducationMutation = useMutation({
    mutationFn: educationApi.deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      setDeleteConfirmEducation(null);
    },
  });

  const createCertificationMutation = useMutation({
    mutationFn: certificationApi.createCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      setShowCertificationForm(false);
    },
  });

  const updateCertificationMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Parameters<typeof certificationApi.updateCertification>[1] }) =>
      certificationApi.updateCertification(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      setShowCertificationForm(false);
      setEditingCertification(null);
    },
  });

  const deleteCertificationMutation = useMutation({
    mutationFn: certificationApi.deleteCertification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      setDeleteConfirmCertification(null);
    },
  });

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const portfolioErrorMessage = getPortfolioErrorMessage(portfolioError);
  const projectsErrorMessage = getPortfolioErrorMessage(projectsError);
  const skillsErrorMessage = getPortfolioErrorMessage(skillsError);
  const experiencesErrorMessage = getPortfolioErrorMessage(experiencesError);
  const educationErrorMessage = getPortfolioErrorMessage(educationError);
  const certificationsErrorMessage = getPortfolioErrorMessage(certificationsError);

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

  const handleAddSkill = () => {
    setEditingSkill(null);
    setShowSkillForm(true);
  };

  const handleEditSkill = (skillId: string) => {
    setEditingSkill(skillId);
    setShowSkillForm(true);
  };

  const handleDeleteSkill = (skillId: string) => {
    setDeleteConfirmSkill(skillId);
  };

  const confirmDeleteSkill = () => {
    if (deleteConfirmSkill) {
      deleteSkillMutation.mutate(deleteConfirmSkill);
    }
  };

  const handleAddExperience = () => {
    setEditingExperience(null);
    setShowExperienceForm(true);
  };

  const handleEditExperience = (experienceId: string) => {
    setEditingExperience(experienceId);
    setShowExperienceForm(true);
  };

  const handleDeleteExperience = (experienceId: string) => {
    setDeleteConfirmExperience(experienceId);
  };

  const confirmDeleteExperience = () => {
    if (deleteConfirmExperience) {
      deleteExperienceMutation.mutate(deleteConfirmExperience);
    }
  };

  const handleAddEducation = () => {
    setEditingEducation(null);
    setShowEducationForm(true);
  };

  const handleEditEducation = (educationId: string) => {
    setEditingEducation(educationId);
    setShowEducationForm(true);
  };

  const handleDeleteEducation = (educationId: string) => {
    setDeleteConfirmEducation(educationId);
  };

  const confirmDeleteEducation = () => {
    if (deleteConfirmEducation) {
      deleteEducationMutation.mutate(deleteConfirmEducation);
    }
  };

  const handleAddCertification = () => {
    setEditingCertification(null);
    setShowCertificationForm(true);
  };

  const handleEditCertification = (certificationId: string) => {
    setEditingCertification(certificationId);
    setShowCertificationForm(true);
  };

  const handleDeleteCertification = (certificationId: string) => {
    setDeleteConfirmCertification(certificationId);
  };

  const confirmDeleteCertification = () => {
    if (deleteConfirmCertification) {
      deleteCertificationMutation.mutate(deleteConfirmCertification);
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

        {portfolio && (
          <section className="portfolio-section" aria-labelledby="skills-section-title">
            <div className="portfolio-section-heading">
              <div>
                <h2 id="skills-section-title">Skills</h2>
                <p>Highlight your technical abilities and expertise.</p>
              </div>
              <button
                type="button"
                className="create-portfolio-button"
                onClick={handleAddSkill}
                disabled={isSkillsLoading}
              >
                <Plus size={18} aria-hidden="true" />
                Add Skill
              </button>
            </div>

            {isSkillsLoading && (
              <div className="portfolio-status-state" role="status" aria-live="polite">
                <p>Loading skills…</p>
              </div>
            )}

            {isSkillsError && (
              <div className="portfolio-status-state portfolio-error-state" role="alert">
                <h3>Could not load skills</h3>
                <p>{skillsErrorMessage}</p>
                <button type="button" className="portfolio-retry-button" onClick={() => refetchSkills()}>
                  Try again
                </button>
              </div>
            )}

            {!isSkillsLoading && !isSkillsError && skills.length === 0 && (
              <div className="portfolio-empty-state">
                <span className="portfolio-empty-icon" aria-hidden="true">
                  <Zap size={28} />
                </span>
                <h3>No skills yet</h3>
                <p>Add your first skill to showcase your expertise.</p>
              </div>
            )}

            {!isSkillsLoading && !isSkillsError && skills.length > 0 && (
              <div className="skills-list">
                {skills.map((skill) => (
                  <div key={skill.id} className="skill-card">
                    <div className="skill-header">
                      <div className="skill-info">
                        <h3 className="skill-name">{skill.name}</h3>
                        <span className="skill-category">{skill.category}</span>
                      </div>
                      <div className="skill-actions">
                        <button
                          type="button"
                          className="project-action-button"
                          onClick={() => handleEditSkill(skill.id)}
                          aria-label={`Edit ${skill.name}`}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          className="project-action-button project-delete-button"
                          onClick={() => handleDeleteSkill(skill.id)}
                          aria-label={`Delete ${skill.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {skill.proficiency !== null && (
                      <div className="skill-proficiency">
                        <div className="skill-proficiency-bar">
                          <div
                            className="skill-proficiency-fill"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                        <span className="skill-proficiency-label">{skill.proficiency}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {portfolio && (
          <section className="portfolio-section" aria-labelledby="experiences-section-title">
            <div className="portfolio-section-heading">
              <div>
                <h2 id="experiences-section-title">Work Experience</h2>
                <p>Showcase your professional journey.</p>
              </div>
              <button
                type="button"
                className="create-portfolio-button"
                onClick={handleAddExperience}
                disabled={isExperiencesLoading}
              >
                <Plus size={18} aria-hidden="true" />
                Add Experience
              </button>
            </div>

            {isExperiencesLoading && (
              <div className="portfolio-status-state" role="status" aria-live="polite">
                <p>Loading experiences…</p>
              </div>
            )}

            {isExperiencesError && (
              <div className="portfolio-status-state portfolio-error-state" role="alert">
                <h3>Could not load experiences</h3>
                <p>{experiencesErrorMessage}</p>
                <button type="button" className="portfolio-retry-button" onClick={() => refetchExperiences()}>
                  Try again
                </button>
              </div>
            )}

            {!isExperiencesLoading && !isExperiencesError && experiences.length === 0 && (
              <div className="portfolio-empty-state">
                <span className="portfolio-empty-icon" aria-hidden="true">
                  <Building2 size={28} />
                </span>
                <h3>No experience yet</h3>
                <p>Add your first work experience to showcase your career.</p>
              </div>
            )}

            {!isExperiencesLoading && !isExperiencesError && experiences.length > 0 && (
              <div className="experiences-list">
                {experiences.map((experience) => (
                  <div key={experience.id} className="experience-card">
                    <div className="experience-header">
                      <div className="experience-info">
                        <h3 className="experience-company">{experience.companyName}</h3>
                        <span className="experience-title">{experience.jobTitle}</span>
                        <div className="experience-dates">
                          <span>{new Date(experience.startDate).toLocaleDateString()}</span>
                          <span> – </span>
                          <span>{experience.isCurrent ? 'Present' : new Date(experience.endDate || '').toLocaleDateString()}</span>
                        </div>
                        {experience.location && (
                          <span className="experience-location">
                            <MapPin size={14} />
                            {experience.location}
                          </span>
                        )}
                        {experience.employmentType && (
                          <span className="experience-type">{experience.employmentType}</span>
                        )}
                      </div>
                      <div className="experience-actions">
                        <button
                          type="button"
                          className="project-action-button"
                          onClick={() => handleEditExperience(experience.id)}
                          aria-label={`Edit ${experience.companyName}`}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          className="project-action-button project-delete-button"
                          onClick={() => handleDeleteExperience(experience.id)}
                          aria-label={`Delete ${experience.companyName}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {experience.description && <p className="experience-description">{experience.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {portfolio && (
          <section className="portfolio-section" aria-labelledby="education-section-title">
            <div className="portfolio-section-heading">
              <div>
                <h2 id="education-section-title">Education</h2>
                <p>Showcase your academic background.</p>
              </div>
              <button
                type="button"
                className="create-portfolio-button"
                onClick={handleAddEducation}
                disabled={isEducationLoading}
              >
                <Plus size={18} aria-hidden="true" />
                Add Education
              </button>
            </div>

            {isEducationLoading && (
              <div className="portfolio-status-state" role="status" aria-live="polite">
                <p>Loading education…</p>
              </div>
            )}

            {isEducationError && (
              <div className="portfolio-status-state portfolio-error-state" role="alert">
                <h3>Could not load education</h3>
                <p>{educationErrorMessage}</p>
                <button type="button" className="portfolio-retry-button" onClick={() => refetchEducation()}>
                  Try again
                </button>
              </div>
            )}

            {!isEducationLoading && !isEducationError && education.length === 0 && (
              <div className="portfolio-empty-state">
                <span className="portfolio-empty-icon" aria-hidden="true">
                  <GraduationCap size={28} />
                </span>
                <h3>No education yet</h3>
                <p>Add your first education to showcase your academic journey.</p>
              </div>
            )}

            {!isEducationLoading && !isEducationError && education.length > 0 && (
              <div className="education-list">
                {education.map((edu) => (
                  <div key={edu.id} className="education-card">
                    <div className="education-header">
                      <div className="education-info">
                        <h3 className="education-institution">{edu.institution}</h3>
                        <span className="education-degree">{edu.degree}</span>
                        {edu.fieldOfStudy && <span className="education-field">{edu.fieldOfStudy}</span>}
                        <div className="education-dates">
                          <span>{new Date(edu.startDate).toLocaleDateString()}</span>
                          <span> – </span>
                          <span>{edu.isCurrent ? 'Present' : new Date(edu.endDate || '').toLocaleDateString()}</span>
                        </div>
                        {edu.location && (
                          <span className="education-location">
                            <MapPin size={14} />
                            {edu.location}
                          </span>
                        )}
                      </div>
                      <div className="education-actions">
                        <button
                          type="button"
                          className="project-action-button"
                          onClick={() => handleEditEducation(edu.id)}
                          aria-label={`Edit ${edu.institution}`}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          className="project-action-button project-delete-button"
                          onClick={() => handleDeleteEducation(edu.id)}
                          aria-label={`Delete ${edu.institution}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {edu.description && <p className="education-description">{edu.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {portfolio && (
          <section className="portfolio-section" aria-labelledby="certifications-section-title">
            <div className="portfolio-section-heading">
              <div>
                <h2 id="certifications-section-title">Certifications</h2>
                <p>Showcase your professional certifications.</p>
              </div>
              <button
                type="button"
                className="create-portfolio-button"
                onClick={handleAddCertification}
                disabled={isCertificationsLoading}
              >
                <Plus size={18} aria-hidden="true" />
                Add Certification
              </button>
            </div>

            {isCertificationsLoading && (
              <div className="portfolio-status-state" role="status" aria-live="polite">
                <p>Loading certifications…</p>
              </div>
            )}

            {isCertificationsError && (
              <div className="portfolio-status-state portfolio-error-state" role="alert">
                <h3>Could not load certifications</h3>
                <p>{certificationsErrorMessage}</p>
                <button type="button" className="portfolio-retry-button" onClick={() => refetchCertifications()}>
                  Try again
                </button>
              </div>
            )}

            {!isCertificationsLoading && !isCertificationsError && certifications.length === 0 && (
              <div className="portfolio-empty-state">
                <span className="portfolio-empty-icon" aria-hidden="true">
                  <Award size={28} />
                </span>
                <h3>No certifications yet</h3>
                <p>Add your first certification to showcase your professional achievements.</p>
              </div>
            )}

            {!isCertificationsLoading && !isCertificationsError && certifications.length > 0 && (
              <div className="certifications-list">
                {certifications.map((cert) => (
                  <div key={cert.id} className="certification-card">
                    <div className="certification-header">
                      <div className="certification-info">
                        <h3 className="certification-name">{cert.name}</h3>
                        <span className="certification-organization">{cert.issuingOrganization}</span>
                        {cert.credentialId && (
                          <span className="certification-credential-id">ID: {cert.credentialId}</span>
                        )}
                        <div className="certification-dates">
                          {cert.issueDate && (
                            <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                          )}
                          {cert.expirationDate && (
                            <>
                              <span> – </span>
                              <span>Expires: {new Date(cert.expirationDate).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="certification-actions">
                        <button
                          type="button"
                          className="project-action-button"
                          onClick={() => handleEditCertification(cert.id)}
                          aria-label={`Edit ${cert.name}`}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          className="project-action-button project-delete-button"
                          onClick={() => handleDeleteCertification(cert.id)}
                          aria-label={`Delete ${cert.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="certification-credential-link"
                      >
                        <ExternalLink size={14} />
                        View Credential
                      </a>
                    )}
                    {cert.description && <p className="certification-description">{cert.description}</p>}
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

      {showSkillForm && (
        <SkillForm
          skill={editingSkill ? skills.find((s) => s.id === editingSkill) || null : null}
          onClose={() => {
            setShowSkillForm(false);
            setEditingSkill(null);
          }}
          onSubmit={(input: CreateSkillInput) => {
            if (editingSkill) {
              updateSkillMutation.mutate({ id: editingSkill, input });
            } else {
              createSkillMutation.mutate(input);
            }
          }}
          isSubmitting={createSkillMutation.isPending || updateSkillMutation.isPending}
        />
      )}

      {showExperienceForm && (
        <ExperienceForm
          experience={editingExperience ? experiences.find((e) => e.id === editingExperience) || null : null}
          onClose={() => {
            setShowExperienceForm(false);
            setEditingExperience(null);
          }}
          onSubmit={(input: CreateExperienceInput) => {
            if (editingExperience) {
              updateExperienceMutation.mutate({ id: editingExperience, input });
            } else {
              createExperienceMutation.mutate(input);
            }
          }}
          isSubmitting={createExperienceMutation.isPending || updateExperienceMutation.isPending}
        />
      )}

      {showEducationForm && (
        <EducationForm
          education={editingEducation ? education.find((e) => e.id === editingEducation) || null : null}
          onClose={() => {
            setShowEducationForm(false);
            setEditingEducation(null);
          }}
          onSubmit={(input: CreateEducationInput) => {
            if (editingEducation) {
              updateEducationMutation.mutate({ id: editingEducation, input });
            } else {
              createEducationMutation.mutate(input);
            }
          }}
          isSubmitting={createEducationMutation.isPending || updateEducationMutation.isPending}
        />
      )}

      {showCertificationForm && (
        <CertificationForm
          certification={editingCertification ? certifications.find((c) => c.id === editingCertification) || null : null}
          onClose={() => {
            setShowCertificationForm(false);
            setEditingCertification(null);
          }}
          onSubmit={(input: CreateCertificationInput) => {
            if (editingCertification) {
              updateCertificationMutation.mutate({ id: editingCertification, input });
            } else {
              createCertificationMutation.mutate(input);
            }
          }}
          isSubmitting={createCertificationMutation.isPending || updateCertificationMutation.isPending}
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

      {deleteConfirmSkill && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmSkill(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Skill</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setDeleteConfirmSkill(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this skill? This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-button modal-button-secondary"
                onClick={() => setDeleteConfirmSkill(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-button modal-button-danger"
                onClick={confirmDeleteSkill}
                disabled={deleteSkillMutation.isPending}
              >
                {deleteSkillMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmExperience && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmExperience(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Experience</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setDeleteConfirmExperience(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this experience? This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-button modal-button-secondary"
                onClick={() => setDeleteConfirmExperience(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-button modal-button-danger"
                onClick={confirmDeleteExperience}
                disabled={deleteExperienceMutation.isPending}
              >
                {deleteExperienceMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmEducation && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmEducation(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Education</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setDeleteConfirmEducation(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this education? This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-button modal-button-secondary"
                onClick={() => setDeleteConfirmEducation(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-button modal-button-danger"
                onClick={confirmDeleteEducation}
                disabled={deleteEducationMutation.isPending}
              >
                {deleteEducationMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmCertification && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmCertification(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Certification</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setDeleteConfirmCertification(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this certification? This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-button modal-button-secondary"
                onClick={() => setDeleteConfirmCertification(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-button modal-button-danger"
                onClick={confirmDeleteCertification}
                disabled={deleteCertificationMutation.isPending}
              >
                {deleteCertificationMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
