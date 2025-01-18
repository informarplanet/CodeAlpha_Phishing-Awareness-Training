document.addEventListener('DOMContentLoaded', () => {
    // Add hover effect for email elements with warnings
    const warningElements = document.querySelectorAll('[data-tooltip]');
    warningElements.forEach(element => {
        element.addEventListener('mouseenter', highlightWarning);
        element.addEventListener('mouseleave', removeHighlight);
    });

    // Add click handlers for indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            // Remove active class from all indicators
            indicators.forEach(ind => ind.classList.remove('active'));
            // Add active class to clicked indicator
            indicator.classList.add('active');
            
            // Highlight corresponding email section
            highlightEmailSection(indicator);
        });
    });

    // Fake button hover effect
    const fakeButton = document.querySelector('.fake-button');
    if (fakeButton) {
        fakeButton.addEventListener('mouseover', showMaliciousUrl);
        fakeButton.addEventListener('mouseout', hideMaliciousUrl);
    }
});

function highlightWarning(event) {
    const element = event.currentTarget;
    element.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
    const warningIcon = element.querySelector('.warning-icon');
    if (warningIcon) {
        warningIcon.style.opacity = '1';
        warningIcon.style.transform = 'scale(1.2)';
    }
}

function removeHighlight(event) {
    const element = event.currentTarget;
    element.style.backgroundColor = '';
    const warningIcon = element.querySelector('.warning-icon');
    if (warningIcon) {
        warningIcon.style.opacity = '0';
        warningIcon.style.transform = 'scale(1)';
    }
}

function showMaliciousUrl(event) {
    const button = event.currentTarget;
    const maliciousUrl = document.createElement('div');
    maliciousUrl.className = 'malicious-url';
    maliciousUrl.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        Actual URL: http://malicious-site.com/fake-bank/login
    `;
    maliciousUrl.style.cssText = `
        position: absolute;
        bottom: 120%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(231, 76, 60, 0.9);
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 0.9rem;
        white-space: nowrap;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    button.style.position = 'relative';
    button.appendChild(maliciousUrl);
}

function hideMaliciousUrl(event) {
    const maliciousUrl = event.currentTarget.querySelector('.malicious-url');
    if (maliciousUrl) {
        maliciousUrl.remove();
    }
}

function highlightEmailSection(indicator) {
    // Remove all highlights first
    document.querySelectorAll('.highlight').forEach(el => {
        el.classList.remove('highlight');
    });

    // Determine which section to highlight based on indicator type
    const type = indicator.querySelector('h3').textContent;
    let targetElement;

    switch (type) {
        case 'Suspicious Sender':
            targetElement = document.querySelector('.header-item.from');
            break;
        case 'Urgency':
            targetElement = document.querySelector('.subject');
            break;
        case 'Generic Greeting':
            targetElement = document.querySelector('.greeting');
            break;
        case 'Suspicious Link':
            targetElement = document.querySelector('.button-container');
            break;
        case 'Poor Grammar':
            targetElement = document.querySelector('.content');
            break;
        case 'Security Claims':
            targetElement = document.querySelector('.footer');
            break;
    }

    if (targetElement) {
        targetElement.classList.add('highlight');
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Add scroll animations
window.addEventListener('scroll', () => {
    const elements = document.querySelectorAll('.indicator, .tip');
    elements.forEach(element => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});
