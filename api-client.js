/**
 * api-client.js — À ajouter dans ton dossier portfolio (front)
 * Ce fichier charge les données depuis le backend et met à jour les pages.
 *
 * ⚠️  Remplace API_URL par l'URL Railway de ton backend après déploiement
 *     Ex: https://portfolio-backend-gl.up.railway.app
 */

const API_URL = 'https://TON-PROJET.up.railway.app'; // ← à remplacer

// ─── Fonction principale ──────────────────────────────────────────────────────
async function loadPortfolioData() {
  try {
    const res = await fetch(`${API_URL}/api/portfolio`);
    if (!res.ok) throw new Error('API inaccessible');
    const data = await res.json();
    return data;
  } catch (e) {
    console.warn('⚠️ API non disponible, données statiques utilisées.');
    return null;
  }
}

// ─── Mise à jour de index.html (Hero) ────────────────────────────────────────
async function initHomePage() {
  const data = await loadPortfolioData();
  if (!data) return;
  const { profile } = data;

  // Titre et sous-titre
  const title = document.querySelector('.hero-title');
  const subtitle = document.querySelector('.hero-subtitle');
  if (title) title.textContent = profile.name.toUpperCase();
  if (subtitle) subtitle.textContent = profile.title;

  // Réseaux sociaux
  updateSocialLinks(profile);
}

// ─── Mise à jour de about.html ────────────────────────────────────────────────
async function initAboutPage() {
  const data = await loadPortfolioData();
  if (!data) return;
  const { profile } = data;

  const desc = document.querySelector('.about-description');
  const email = document.querySelector('.email-link');
  const location = document.querySelector('.location-text');
  const avatar = document.querySelector('.profile-image');

  if (desc) desc.textContent = profile.bio;
  if (email) { email.textContent = profile.email; email.href = 'mailto:' + profile.email; }
  if (location) location.textContent = profile.location;
  if (avatar && profile.avatar_url) avatar.src = profile.avatar_url;

  updateSocialLinks(profile);
}

// ─── Mise à jour de portfolio.html ───────────────────────────────────────────
async function initPortfolioPage() {
  const data = await loadPortfolioData();
  if (!data) return;

  const grid = document.querySelector('.portfolio-grid');
  if (!grid) return;

  // Vide la grille et la remplit avec les données API
  grid.innerHTML = data.projects.map(project => `
    <div class="project-card">
      <div class="project-image">
        <img src="${project.image_url || ''}" alt="${project.title}" class="project-img"
             onerror="this.src='https://via.placeholder.com/400x250?text=Projet'">
      </div>
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description || ''}</p>
        ${project.project_url
          ? `<a href="${project.project_url}" target="_blank" rel="noopener" class="project-button">Voir plus</a>`
          : `<button class="project-button" disabled>Bientôt</button>`
        }
      </div>
    </div>
  `).join('');
}

// ─── Mise à jour de resume.html ───────────────────────────────────────────────
async function initResumePage() {
  const data = await loadPortfolioData();
  if (!data) return;

  // Skills — barres de progression
  const skillsList = document.querySelector('.skills-list');
  if (skillsList) {
    const softwareSkills = data.skills.filter(s => s.category === 'software');
    skillsList.innerHTML = softwareSkills.map(skill => `
      <div class="skill-item">
        <div class="skill-info">
          <span class="skill-name">${skill.name}</span>
          <span class="skill-percentage">${skill.percentage}%</span>
        </div>
        <div class="skill-bar">
          <div class="skill-progress" data-percentage="${skill.percentage}"></div>
        </div>
      </div>
    `).join('');
  }

  // Languages
  const langList = document.querySelectorAll('.skills-list')[1];
  if (langList) {
    const langs = data.skills.filter(s => s.category === 'language');
    langList.innerHTML = langs.map(skill => `
      <div class="skill-item">
        <div class="skill-info">
          <span class="skill-name">${skill.name}</span>
          <span class="skill-percentage">${skill.percentage}%</span>
        </div>
        <div class="skill-bar">
          <div class="skill-progress" data-percentage="${skill.percentage}"></div>
        </div>
      </div>
    `).join('');
  }

  // Education timeline
  const eduTimeline = document.querySelector('.education-timeline');
  if (eduTimeline) {
    eduTimeline.innerHTML = data.education.map(edu => `
      <div class="education-item">
        <div class="education-dot"></div>
        <div class="education-content">
          <h3 class="education-title">${edu.degree}</h3>
          <p class="education-school">${edu.school}</p>
          <p class="education-period">${edu.year_start} – ${edu.year_end}</p>
        </div>
      </div>
    `).join('');
  }
}

// ─── Helper : mise à jour des liens sociaux ───────────────────────────────────
function updateSocialLinks(profile) {
  const map = {
    '[aria-label="GitHub"]':   profile.github_url,
    '[aria-label="LinkedIn"]': profile.linkedin_url,
    '[aria-label="Twitter"]':  profile.twitter_url,
    '[aria-label="Facebook"]': profile.facebook_url,
  };
  Object.entries(map).forEach(([selector, url]) => {
    document.querySelectorAll(selector).forEach(el => { if (url) el.href = url; });
  });
}

// ─── Détection automatique de la page et init ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname;

  if (page.includes('about'))     initAboutPage();
  else if (page.includes('portfolio')) initPortfolioPage();
  else if (page.includes('resume'))    initResumePage();
  else                                 initHomePage(); // index.html
});
