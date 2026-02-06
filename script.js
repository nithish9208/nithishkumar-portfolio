// Navigation & Mobile Menu
const navbar = document.getElementById('navbar');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links li a');

// Toggle Mobile Menu
mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Animate hamburger to X
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Sticky Navbar on Scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Active Link Highlight
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(li => {
        li.classList.remove('active');
        if (li.getAttribute('href').includes(current)) {
            li.classList.add('active');
        }
    });
});

// Modal Logic
const modal = document.getElementById('modal-container');
const modalBody = document.getElementById('modal-body');

function openModal(id) {
    const project = projectData[id];
    
    if (!project) return;
    
    const toolsArray = project.tools.split(',').map(t => `<span>${t.trim()}</span>`).join('');
    
    const content = `
        <h2 class="modal-title">${project.title}</h2>
        
        <div class="modal-section">
            <h4>Problem</h4>
            <p>${project.problem}</p>
        </div>
        
        <div class="modal-section">
            <h4>Approach</h4>
            <p>${project.approach}</p>
        </div>
        
        <div class="modal-section modal-tools">
            <h4>Tools Used</h4>
            <div class="tags">${toolsArray}</div>
        </div>
        
        <div class="modal-section">
            <h4>Key Insight</h4>
            <p><em>"${project.insight}"</em></p>
        </div>
        
        <div class="modal-section">
            <h4>Business Decision</h4>
            <p>${project.decision}</p>
        </div>
        
        <div class="modal-section modal-impact">
            <h4>Business Impact</h4>
            <p><strong>${project.impact}</strong></p>
        </div>
        
        <div class="text-center" style="margin-top: 30px;">
           <a href="#" class="btn btn-primary">View on GitHub</a>
        </div>
    `;
    
    modalBody.innerHTML = content;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}
