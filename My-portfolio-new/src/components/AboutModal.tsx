import { useEffect } from "react";
import { portfolioData } from "../data/portfolio";

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

const AboutModal = ({ open, onClose }: AboutModalProps) => {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const { about } = portfolioData;

  return (
    <div
      className={`modal-backdrop ${open ? "modal-backdrop--open" : ""}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="About me"
    >
      <div
        className={`modal-panel ${open ? "modal-panel--open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-inner">
          {/* Left: avatar + stats */}
          <div className="modal-left">
            <div className="modal-avatar">
              <div className="modal-avatar-inner">{portfolioData.initials}</div>
              <div className="modal-ring r1" />
              <div className="modal-ring r2" />
            </div>

            <div className="modal-stats">
              <div className="modal-stat">
                <span className="modal-stat-num">3+</span>
                <span className="modal-stat-label">Years Exp.</span>
              </div>
              <div className="modal-stat">
                <span className="modal-stat-num">20+</span>
                <span className="modal-stat-label">Projects</span>
              </div>
              <div className="modal-stat">
                <span className="modal-stat-num">15+</span>
                <span className="modal-stat-label">Clients</span>
              </div>
            </div>

            {/* Social links */}
            <div className="modal-socials">
              <a href={portfolioData.social.github} target="_blank" rel="noopener noreferrer" className="modal-social-btn" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
              <a href={portfolioData.social.linkedin} target="_blank" rel="noopener noreferrer" className="modal-social-btn" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href={portfolioData.social.twitter} target="_blank" rel="noopener noreferrer" className="modal-social-btn" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right: text content */}
          <div className="modal-right">
            <div className="modal-tag">Get To Know Me</div>
            <h2 className="modal-title">About Me</h2>
            <p className="modal-desc">{about.description}</p>

            <div className="modal-skills-title">Tech Stack</div>
            <div className="modal-skills">
              {about.skills.map((s) => (
                <span key={s} className="modal-skill">{s}</span>
              ))}
            </div>

            <div className="modal-actions">
              <a href={`mailto:${portfolioData.email}`} className="btn-primary">
                Hire Me
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </a>
              <a href="#" className="btn-outline" download>
                Download CV
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
