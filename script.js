// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const hamburger = document.getElementById('navbar-hamburger');
    const menu = document.getElementById('navbar-menu');
    const menuLinks = document.querySelectorAll('.navbar-link');
    
    // Fonction pour basculer le menu mobile
    function toggleMobileMenu() {
        menu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Empêcher le scroll du body quand le menu est ouvert
        if (menu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
    
    // Fonction pour fermer le menu mobile
    function closeMobileMenu() {
        menu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Event listener pour l'icône hamburger
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMobileMenu();
    });
    
    // Event listeners pour les liens du menu
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Fermer le menu mobile après clic sur un lien
            if (window.innerWidth < 1024) {
                closeMobileMenu();
            }
            
            // Gestion du lien actif
            updateActiveLink(this);
        });
    });
    
    // Fonction pour mettre à jour le lien actif
    function updateActiveLink(clickedLink) {
        // Retirer la classe active de tous les liens
        menuLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Ajouter la classe active au lien cliqué
        clickedLink.classList.add('active');
    }
    
    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        // Si on passe en mode desktop, fermer le menu mobile
        if (window.innerWidth >= 1024) {
            closeMobileMenu();
        }
    });
    
    // Gestion du scroll pour mettre à jour le lien actif selon la section visible
    function updateActiveLinkOnScroll() {
        const sections = document.querySelectorAll('.section');
        const scrollPos = window.scrollY + 100; // Offset pour déclencher avant d'arriver à la section
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Retirer la classe active de tous les liens
                menuLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Ajouter la classe active au lien correspondant
                const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Event listener pour le scroll
    window.addEventListener('scroll', updateActiveLinkOnScroll);
    
    // Fermer le menu en cliquant à l'extérieur (mobile uniquement)
    document.addEventListener('click', function(e) {
        if (window.innerWidth < 1024) {
            const isClickInsideMenu = menu.contains(e.target);
            const isClickOnHamburger = hamburger.contains(e.target);
            
            if (!isClickInsideMenu && !isClickOnHamburger && menu.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });
    
    // Gestion des touches clavier pour l'accessibilité
    hamburger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    });
    
    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Animation d'apparition des éléments au scroll (bonus)
    function animateOnScroll() {
        const sections = document.querySelectorAll('.section');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionVisible = 150;
            
            if (sectionTop < window.innerHeight - sectionVisible) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initialiser les styles pour l'animation
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Event listener pour l'animation au scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Initialiser l'animation pour la première section
    animateOnScroll();
    
    // Animation des barres de progression pour la page Resume
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach(bar => {
            const percentage = bar.getAttribute('data-percentage');
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !bar.classList.contains('animated')) {
                bar.style.width = percentage + '%';
                bar.classList.add('animated');
            }
        });
    }
    
    // Event listener pour l'animation des barres de progression
    window.addEventListener('scroll', animateSkillBars);
    
    // Initialiser l'animation des barres si on est sur la page Resume
    if (document.querySelector('.resume-section')) {
        animateSkillBars();
    }
});
