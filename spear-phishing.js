document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects for warning elements
    const warningElements = document.querySelectorAll('[data-tooltip]');
    warningElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            const icon = element.querySelector('.warning-icon');
            if (icon) {
                icon.style.opacity = '1';
                icon.style.transform = 'scale(1.2)';
                icon.classList.add('active');
            }
        });

        element.addEventListener('mouseleave', () => {
            const icon = element.querySelector('.warning-icon');
            if (icon) {
                icon.style.opacity = '0';
                icon.style.transform = 'scale(1)';
                icon.classList.remove('active');
            }
        });
    });

    // Add scroll animations for cards
    const cards = document.querySelectorAll('.characteristic-card, .indicator, .tip-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = entry.target.classList.contains('indicator') 
                    ? 'translateX(0)' 
                    : 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = card.classList.contains('indicator')
            ? 'translateX(-20px)'
            : 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        observer.observe(card);
    });

    // Add attachment warning
    const attachment = document.querySelector('.attachment');
    if (attachment) {
        attachment.addEventListener('click', () => {
            const warning = document.createElement('div');
            warning.className = 'attachment-warning';
            warning.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <p>Warning: This attachment could contain malware!</p>
            `;
            warning.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(231, 76, 60, 0.95);
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                text-align: center;
                z-index: 1000;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            `;
            document.body.appendChild(warning);
            setTimeout(() => warning.remove(), 3000);
        });
    }

    // Highlight characteristics on scroll
    const characteristics = document.querySelectorAll('.characteristic-card');
    characteristics.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });
});
