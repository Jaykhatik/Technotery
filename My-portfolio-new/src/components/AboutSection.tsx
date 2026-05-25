import { portfolioData } from "../data/portfolio";

const AboutSection = () => {
  const { about } = portfolioData;

  return (
    <section className="section about-section" id="about">
      <div className="section-header">
        <span className="section-tag">Get To Know</span>
        <h2 className="section-title">About Me</h2>
      </div>

      <div className="about-grid">
        {/* Avatar / visual */}
        <div className="about-visual">
          <div className="about-avatar">
            <div className="avatar-initials">{portfolioData.initials}</div>
            <div className="avatar-ring ring-1" />
            <div className="avatar-ring ring-2" />
            <div className="avatar-ring ring-3" />
          </div>

          {/* Stats */}
          <div className="about-stats">
            <div className="stat-card">
              <span className="stat-number">3+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">20+</span>
              <span className="stat-label">Projects Done</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">15+</span>
              <span className="stat-label">Happy Clients</span>
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="about-text">
          <p className="about-description">{about.description}</p>

          <div className="skills-section">
            <h3 className="skills-title">Tech Stack</h3>
            <div className="skills-grid">
              {about.skills.map((skill) => (
                <span key={skill} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="about-actions">
            <a href={`mailto:${portfolioData.email}`} className="btn-primary">
              Hire Me
            </a>
            <a href="#" className="btn-outline" download>
              Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
