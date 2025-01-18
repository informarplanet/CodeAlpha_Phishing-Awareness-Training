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
    const cards = document.querySelectorAll('.pattern-card, .flag-item, .prevention-card, .step');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = entry.target.classList.contains('flag-item')
                    ? 'translateX(0)'
                    : 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = card.classList.contains('flag-item')
            ? 'translateX(-20px)'
            : 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        observer.observe(card);
    });

    // Add interactive highlighting for red flags
    const flagItems = document.querySelectorAll('.flag-item');
    const emailContainer = document.querySelector('.email-container');
    
    flagItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const flagType = item.getAttribute('data-flag');
            highlightEmailSection(flagType);
        });

        item.addEventListener('mouseleave', () => {
            removeEmailHighlights();
        });
    });

    function highlightEmailSection(flagType) {
        const emailContent = document.querySelector('.email-body');
        const emailHeader = document.querySelector('.email-header');
        
        switch(flagType) {
            case 'domain':
                const fromAddress = emailHeader.querySelector('.header-item:first-child');
                fromAddress.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
                break;
            case 'urgency':
                const urgentContent = emailContent.querySelectorAll('p')[0];
                urgentContent.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
                break;
            case 'secrecy':
                const secrecyContent = emailContent.querySelectorAll('p')[4];
                secrecyContent.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
                break;
            case 'procedure':
                const wireDetails = document.querySelector('.wire-details');
                wireDetails.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
                break;
        }
    }

    function removeEmailHighlights() {
        const elements = document.querySelectorAll('.email-container *');
        elements.forEach(element => {
            element.style.backgroundColor = '';
        });
    }

    // Add hover effect for wire details
    const wireDetails = document.querySelector('.wire-details');
    if (wireDetails) {
        wireDetails.addEventListener('mouseenter', () => {
            wireDetails.style.borderLeftColor = var(--accent-color);
            wireDetails.style.transform = 'scale(1.02)';
        });

        wireDetails.addEventListener('mouseleave', () => {
            wireDetails.style.borderLeftColor = var(--warning-color);
            wireDetails.style.transform = 'scale(1)';
        });
    }

    // Add sequential animation for protocol steps
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        setTimeout(() => {
            step.style.opacity = '1';
            step.style.transform = 'translateY(0)';
        }, index * 200);
    });
});
