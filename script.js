// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: false,
    mirror: true,
    offset: 50,
    easing: 'ease-out-cubic'
});

let currentSlide = 0; // Start from 0 for first slide
const totalSlides = document.querySelectorAll('.slide').length;

// Update slide navigation
function updateSlide() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.style.display = 'block';
            // Add entrance animation
            slide.style.opacity = '0';
            setTimeout(() => {
                slide.style.opacity = '1';
            }, 50);
        } else {
            slide.style.display = 'none';
        }
    });
    
    // Update progress bar if it exists
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const progress = ((currentSlide + 1) / slides.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Update navigation buttons
    const prevButton = document.querySelector('.navigation button:first-child');
    const nextButton = document.querySelector('.navigation button:last-child');
    
    if (prevButton) {
        prevButton.disabled = currentSlide === 0;
    }
    if (nextButton) {
        nextButton.disabled = currentSlide === slides.length - 1;
    }

    // Update URL hash without triggering hashchange event
    const currentSlideElement = slides[currentSlide];
    if (currentSlideElement && currentSlideElement.id) {
        history.replaceState(null, null, `#${currentSlideElement.id}`);
    }
}

// Navigation functions
function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        updateSlide();
    }
}

function previousSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlide();
    }
}

// Handle hash navigation
function handleHashNavigation() {
    const hash = window.location.hash;
    if (hash) {
        const slideId = hash.replace('#', '');
        const slides = document.querySelectorAll('.slide');
        const slideIndex = Array.from(slides).findIndex(slide => slide.id === slideId);
        if (slideIndex !== -1) {
            currentSlide = slideIndex;
            updateSlide();
            // Ensure the slide is visible after navigation
            setTimeout(() => {
                slides[slideIndex].scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
}

// Initialize presentation
document.addEventListener('DOMContentLoaded', () => {
    // Hide all slides first
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.style.display = 'none';
    });

    // Check if there's a hash in the URL
    if (window.location.hash) {
        handleHashNavigation();
    } else {
        // If no hash, start from first slide
        currentSlide = 0;
        updateSlide();
    }

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'Space') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            previousSlide();
        }
    });

    // Handle swipe navigation on touch devices
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                previousSlide();
            } else {
                nextSlide();
            }
        }
    }
});

// Listen for hash changes
window.addEventListener('hashchange', handleHashNavigation);

// Show initial slide with animation
document.getElementById('slide1').style.display = 'block';
setTimeout(() => {
    document.getElementById('slide1').style.opacity = '1';
    document.getElementById('slide1').style.transform = 'translateY(0)';
}, 100);

function showSlide(slideNumber) {
    const slides = document.querySelectorAll('.slide');
    const currentSlideElement = document.querySelector('.slide[style*="display: block"]');
    const nextSlide = document.getElementById('slide' + slideNumber);

    // Fade out current slide
    if (currentSlideElement) {
        currentSlideElement.style.opacity = '0';
        currentSlideElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            currentSlideElement.style.display = 'none';
            
            // Show and animate in next slide
            if (nextSlide) {
                nextSlide.style.display = 'block';
                setTimeout(() => {
                    nextSlide.style.opacity = '1';
                    nextSlide.style.transform = 'translateY(0)';
                    AOS.refresh();
                }, 50);
            }
        }, 300);
    } else if (nextSlide) {
        // If no current slide is shown, just show the next one
        nextSlide.style.display = 'block';
        setTimeout(() => {
            nextSlide.style.opacity = '1';
            nextSlide.style.transform = 'translateY(0)';
            AOS.refresh();
        }, 50);
    }
}

function showPhishingIndicators() {
    const indicators = [
        {
            element: '.email-example .email-header',
            message: 'Generic sender address trying to look legitimate'
        },
        {
            element: '.phishing-link',
            message: 'Suspicious URL that mimics a legitimate bank domain'
        },
        {
            element: '.email-body',
            message: 'Creates urgency and fear to prompt immediate action'
        }
    ];

    indicators.forEach((indicator, index) => {
        const element = document.querySelector(indicator.element);
        if (element) {
            element.style.position = 'relative';
            
            setTimeout(() => {
                const indicatorElement = document.createElement('div');
                indicatorElement.style.cssText = `
                    position: absolute;
                    background: rgba(231, 76, 60, 0.1);
                    border: 2px solid #e74c3c;
                    border-radius: 4px;
                    padding: 10px;
                    margin-top: 10px;
                    color: #e74c3c;
                    font-size: 0.9em;
                    z-index: 100;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.5s ease;
                `;
                indicatorElement.textContent = indicator.message;
                
                element.appendChild(indicatorElement);
                
                // Trigger animation
                setTimeout(() => {
                    indicatorElement.style.opacity = '1';
                    indicatorElement.style.transform = 'translateY(0)';
                }, 50);
            }, index * 500); // Stagger the animations
        }
    });
    
    // Disable the button after showing indicators
    const button = document.querySelector('.check-button');
    button.disabled = true;
    button.style.opacity = '0.5';
}

// Add parallax effect to icons
document.addEventListener('mousemove', (e) => {
    const icons = document.querySelectorAll('.icon-container i');
    icons.forEach(icon => {
        const rect = icon.getBoundingClientRect();
        const x = (e.clientX - rect.left) / 25;
        const y = (e.clientY - rect.top) / 25;
        icon.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Keyboard navigation with animation feedback
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        nextSlide();
        const rightButton = document.querySelector('.navigation button:last-child');
        rightButton.style.transform = 'scale(0.9)';
        setTimeout(() => rightButton.style.transform = '', 200);
    } else if (e.key === 'ArrowLeft') {
        previousSlide();
        const leftButton = document.querySelector('.navigation button:first-child');
        leftButton.style.transform = 'scale(0.9)';
        setTimeout(() => leftButton.style.transform = '', 200);
    }
});

// Phishing Email Example Interactions
document.addEventListener('DOMContentLoaded', () => {
    const indicators = document.querySelectorAll('.indicator');
    const emailSections = {
        'sender': '.header-item:first-child',
        'subject': '.header-item:nth-child(2)',
        'greeting': '.greeting',
        'link': '.action-button'
    };

    // Add click handlers for indicators
    indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            // Remove active class from all indicators
            indicators.forEach(ind => ind.classList.remove('active'));
            // Add active class to clicked indicator
            indicator.classList.add('active');

            // Remove highlight from all sections
            Object.values(emailSections).forEach(selector => {
                document.querySelector(selector)?.classList.remove('highlight');
            });

            // Highlight corresponding section
            const target = indicator.getAttribute('data-target');
            const section = document.querySelector(emailSections[target]);
            if (section) {
                section.classList.add('highlight');
                section.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });

    // Add hover effects for warning elements
    const warningElements = document.querySelectorAll('[data-tooltip]');
    warningElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            const icon = element.querySelector('.warning-icon');
            if (icon) {
                icon.style.opacity = '1';
                icon.style.transform = 'scale(1.2)';
            }
            element.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
        });

        element.addEventListener('mouseleave', () => {
            const icon = element.querySelector('.warning-icon');
            if (icon) {
                icon.style.opacity = '0';
                icon.style.transform = 'scale(1)';
            }
            element.style.backgroundColor = '';
        });
    });
});

// Phishing Cards Click Functionality
document.addEventListener('DOMContentLoaded', () => {
    const phishingCards = document.querySelectorAll('.phishing-card');
    
    phishingCards.forEach(card => {
        const flipPrompt = card.querySelector('.flip-prompt');
        const cardType = card.getAttribute('data-type');
        
        // Set up page URLs for each card type
        const pageUrls = {
            'email': 'email-analysis.html',
            'spear': 'spear-phishing.html',
            'whaling': 'bec-analysis.html',
            'smishing': 'smishing.html',
            'vishing': 'vishing.html',
            'clone': 'clone-phishing.html'
        };

        // Handle card flip
        card.addEventListener('click', (e) => {
            // Don't flip if clicking the learn more button
            if (!e.target.classList.contains('flip-prompt')) {
                const cardInner = card.querySelector('.card-inner');
                cardInner.style.transform = cardInner.style.transform === 'rotateY(180deg)' 
                    ? 'rotateY(0deg)' 
                    : 'rotateY(180deg)';
            }
        });

        // Handle learn more navigation
        if (flipPrompt) {
            flipPrompt.style.cursor = 'pointer';
            flipPrompt.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card flip
                const url = pageUrls[cardType];
                if (url) {
                    window.location.href = url;
                }
            });
        }

        // Add keyboard accessibility
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const cardInner = card.querySelector('.card-inner');
                cardInner.style.transform = cardInner.style.transform === 'rotateY(180deg)' 
                    ? 'rotateY(0deg)' 
                    : 'rotateY(180deg)';
            }
        });

        // Make cards focusable
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Learn more about ${card.querySelector('h3').textContent}`);
    });
});

// Red Flags Modal Data
const flagData = {
    urgent: {
        title: "Urgent or Threatening Language",
        icon: "fas fa-exclamation-circle",
        example: "Your account will be suspended in 24 hours! Immediate action required to prevent account closure. Click here now to verify your identity!",
        dangers: [
            "Creates panic and forces rushed decisions",
            "Bypasses normal critical thinking",
            "Exploits fear of loss or consequences",
            "Prevents proper verification of request"
        ],
        spotting: [
            "Look for urgent deadlines (24 hours, immediately, now)",
            "Check for threatening consequences",
            "Notice excessive exclamation marks",
            "Watch for pressure tactics"
        ],
        actions: [
            "Take a deep breath and pause",
            "Verify the request through official channels",
            "Never click links in urgent messages",
            "Report suspicious urgent emails"
        ]
    },
    personal: {
        title: "Requests for Personal Information",
        icon: "fas fa-user-secret",
        example: "We've detected suspicious activity on your account. Please confirm your identity by providing your username, password, and social security number.",
        dangers: [
            "Direct theft of sensitive information",
            "Identity theft risk",
            "Account compromise",
            "Financial fraud potential"
        ],
        spotting: [
            "Requests for passwords or PINs",
            "Asking for social security numbers",
            "Seeking banking information",
            "Requesting personal verification details"
        ],
        actions: [
            "Never share sensitive information via email",
            "Contact the company directly using official numbers",
            "Use secure, official websites for updates",
            "Enable two-factor authentication"
        ]
    },
    mismatch: {
        title: "Mismatched Email Addresses",
        icon: "fas fa-envelope",
        example: "From: support@apple-secure-verify.com\nDisplay Name: Apple Support\nSubject: Apple ID Security Alert",
        dangers: [
            "Impersonation of legitimate companies",
            "Bypass of email filters",
            "Creation of false trust",
            "Hidden malicious origins"
        ],
        spotting: [
            "Check the actual email address, not just display name",
            "Look for slight misspellings in domain",
            "Compare against known company domains",
            "Verify email headers"
        ],
        actions: [
            "Hover over or click sender name to see full address",
            "Compare with previous legitimate emails",
            "Report suspicious domains",
            "Update email security settings"
        ]
    },
    grammar: {
        title: "Poor Grammar and Spelling",
        icon: "fas fa-spell-check",
        example: "Dear Valued Customer,\n\nWe have notice suspicious activity in you're account. Please to click below for verify account informations.",
        dangers: [
            "Indicates unprofessional or fake sources",
            "Often a sign of foreign scam operations",
            "Shows lack of quality control",
            "May target less careful readers"
        ],
        spotting: [
            "Look for obvious spelling mistakes",
            "Check for incorrect grammar usage",
            "Notice awkward phrasing",
            "Watch for inconsistent formatting"
        ],
        actions: [
            "Compare with professional company communications",
            "Trust your instincts about poor quality",
            "Report obviously fake messages",
            "Mark as spam in email client"
        ]
    }
};

// Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('flagModal');
    const closeBtn = document.querySelector('.close-btn');
    const detailsBtns = document.querySelectorAll('.details-btn');

    function openModal(flagType) {
        const data = flagData[flagType];
        if (!data) return;

        // Update modal content
        document.querySelector('.modal-icon').className = `modal-icon ${data.icon}`;
        document.querySelector('.modal-title').textContent = data.title;
        document.querySelector('.example-content').textContent = data.example;

        // Clear and update lists
        const dangerList = document.querySelector('.danger-list');
        const spotList = document.querySelector('.spot-list');
        const actionList = document.querySelector('.action-list');

        dangerList.innerHTML = data.dangers.map(item => `<li>${item}</li>`).join('');
        spotList.innerHTML = data.spotting.map(item => `<li>${item}</li>`).join('');
        actionList.innerHTML = data.actions.map(item => `<li>${item}</li>`).join('');

        // Show modal with animation
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
            modal.querySelector('.modal-content').style.transform = 'translateY(0)';
        }, 10);
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.querySelector('.modal-content').style.transform = 'translateY(-50px)';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    // Event Listeners
    detailsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const flagType = btn.closest('.red-flag').getAttribute('data-flag');
            openModal(flagType);
        });
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Add hover animations for red flags
    const redFlags = document.querySelectorAll('.red-flag');
    redFlags.forEach(flag => {
        flag.addEventListener('mouseenter', () => {
            flag.style.transform = 'translateY(-5px)';
            flag.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
        });

        flag.addEventListener('mouseleave', () => {
            flag.style.transform = 'translateY(0)';
            flag.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });
});

// Best Practices Modal Data
const practiceData = {
    'verify-sender': {
        title: 'Verify Sender Emails',
        icon: 'fas fa-envelope-open-text',
        description: 'Email sender verification is crucial in preventing phishing attacks. Attackers often impersonate legitimate organizations by using similar-looking email addresses. Understanding how to properly verify sender emails can significantly reduce the risk of falling victim to phishing attempts.',
        steps: [
            'Check the full email address, not just the display name',
            'Look for subtle misspellings in the domain (e.g., microsft.com vs microsoft.com)',
            'Verify the email header information for the original sender',
            'Compare with previous legitimate emails from the same organization',
            'Use email authentication tools to verify sender legitimacy'
        ],
        tools: [
            'Email client built-in security features',
            'Email header analyzers',
            'Domain verification tools',
            'SPF/DKIM/DMARC record checkers',
            'Anti-phishing browser extensions'
        ],
        tips: [
            'Hover over or click the sender name to reveal the full email address',
            'Be especially cautious with emails requesting urgent action',
            'Check if the email domain matches the organization\'s official domain',
            'Use email filtering and security software',
            'Keep a list of trusted sender addresses for important contacts'
        ]
    },
    'multi-factor': {
        title: 'Multi-Factor Authentication',
        icon: 'fas fa-shield-alt',
        description: 'Multi-factor authentication (MFA) adds an extra layer of security by requiring multiple forms of verification before granting access to an account. This significantly reduces the risk of unauthorized access even if credentials are compromised.',
        steps: [
            'Enable MFA on all important accounts',
            'Choose appropriate authentication methods',
            'Set up backup authentication options',
            'Regularly review and update security settings',
            'Keep recovery codes in a secure location'
        ],
        tools: [
            'Authenticator apps (Google Authenticator, Microsoft Authenticator)',
            'Hardware security keys',
            'Biometric authentication',
            'SMS/Email verification',
            'Backup codes'
        ],
        tips: [
            'Use authenticator apps instead of SMS where possible',
            'Keep your authentication device separate from your primary device',
            'Regularly update authentication apps',
            'Never share verification codes with anyone',
            'Enable biometric authentication when available'
        ]
    },
    'updates': {
        title: 'Keep Systems Updated',
        icon: 'fas fa-sync-alt',
        description: 'Regular system updates are essential for maintaining security. Updates often include patches for security vulnerabilities that could be exploited by attackers to gain unauthorized access or deploy malware.',
        steps: [
            'Enable automatic updates when possible',
            'Regularly check for system and software updates',
            'Schedule updates during off-hours',
            'Verify update authenticity',
            'Maintain backup before major updates'
        ],
        tools: [
            'Operating system update tools',
            'Software update managers',
            'Patch management systems',
            'Security update notifications',
            'Backup solutions'
        ],
        tips: [
            'Never postpone security updates indefinitely',
            'Use only official update channels',
            'Keep all software, not just the operating system, updated',
            'Monitor security bulletins for critical updates',
            'Maintain system backups before major updates'
        ]
    },
    'report': {
        title: 'Report Suspicious Emails',
        icon: 'fas fa-flag',
        description: 'Reporting suspicious emails helps protect your organization and others from phishing attacks. Quick reporting allows security teams to respond promptly and prevent potential breaches.',
        steps: [
            'Identify suspicious email characteristics',
            'Use the built-in report phishing button',
            'Forward suspicious emails to IT security',
            'Preserve email headers when reporting',
            'Document any actions taken'
        ],
        tools: [
            'Email client reporting features',
            'Security incident reporting systems',
            'Phishing report buttons',
            'IT helpdesk ticketing system',
            'Screenshot tools for documentation'
        ],
        tips: [
            'Report before deleting suspicious emails',
            'Include original headers when reporting',
            'Never forward suspicious emails to colleagues',
            'Keep track of reported incidents',
            'Follow up on reported incidents if necessary'
        ]
    }
};

// Best Practices Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    const practicesModal = document.getElementById('practicesModal');
    const practiceDetailsBtns = document.querySelectorAll('.practice-details-btn');
    const practiceCloseBtn = practicesModal.querySelector('.close-btn');

    function openPracticesModal(practiceType) {
        const data = practiceData[practiceType];
        if (!data) return;

        // Update modal content
        practicesModal.querySelector('.modal-icon').className = `modal-icon ${data.icon}`;
        practicesModal.querySelector('.modal-title').textContent = data.title;
        practicesModal.querySelector('.practice-description').textContent = data.description;

        // Update lists
        const stepsList = practicesModal.querySelector('.steps-list');
        const toolsList = practicesModal.querySelector('.tools-list');
        const tipsList = practicesModal.querySelector('.tips-list');

        stepsList.innerHTML = data.steps.map(step => `<li>${step}</li>`).join('');
        toolsList.innerHTML = data.tools.map(tool => `<li>${tool}</li>`).join('');
        tipsList.innerHTML = data.tips.map(tip => `<li>${tip}</li>`).join('');

        // Show modal with animation
        practicesModal.style.display = 'flex';
        setTimeout(() => {
            practicesModal.classList.add('active');
            practicesModal.querySelector('.modal-content').style.transform = 'translateY(0)';
        }, 10);
    }

    function closePracticesModal() {
        practicesModal.classList.remove('active');
        practicesModal.querySelector('.modal-content').style.transform = 'translateY(-50px)';
        setTimeout(() => {
            practicesModal.style.display = 'none';
        }, 300);
    }

    // Event Listeners
    practiceDetailsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const practiceType = btn.closest('.practice-card').getAttribute('data-practice');
            openPracticesModal(practiceType);
        });
    });

    practiceCloseBtn.addEventListener('click', closePracticesModal);

    practicesModal.addEventListener('click', (e) => {
        if (e.target === practicesModal) {
            closePracticesModal();
        }
    });

    // Keyboard accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && practicesModal.classList.contains('active')) {
            closePracticesModal();
        }
    });

    // Add hover effects for practice cards
    const practiceCards = document.querySelectorAll('.practice-card');
    practiceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.15)';
            card.style.borderColor = 'var(--secondary-color)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            card.style.borderColor = 'transparent';
        });
    });
});

// Response Steps Modal Data
const responseData = {
    'passwords': {
        title: 'Change Passwords Immediately',
        icon: 'fas fa-key',
        description: 'If you suspect your accounts have been compromised, changing passwords immediately is crucial. Start with your most sensitive accounts and work your way down to less critical ones.',
        actions: [
            'Log out of all active sessions across all devices',
            'Start with your email account password',
            'Change passwords for financial accounts',
            'Update passwords for all linked accounts',
            'Enable two-factor authentication wherever possible'
        ],
        checklist: [
            'Email account password changed',
            'Banking/financial passwords updated',
            'Social media accounts secured',
            'Cloud storage passwords reset',
            'Work-related accounts updated',
            'Online shopping account passwords changed',
            'Password manager master password updated',
            'Recovery email addresses verified',
            'Security questions reviewed and updated',
            'Two-factor authentication enabled on all possible accounts'
        ],
        resources: [
            'Password manager tools (LastPass, 1Password, Bitwarden)',
            'Two-factor authentication apps',
            'Have I Been Pwned - check if your accounts were compromised',
            'Google Security Checkup',
            'Microsoft Account Security'
        ],
        timeline: [
            'Immediately: Change critical passwords (email, banking)',
            'Within 1 hour: Update social media and work accounts',
            'Within 24 hours: Change all remaining passwords',
            'Within 48 hours: Review all account activity',
            'Within 1 week: Set up password manager and 2FA'
        ]
    },
    'report-incident': {
        title: 'Report the Incident',
        icon: 'fas fa-file-alt',
        description: 'Reporting the incident helps prevent future attacks and may assist in recovering lost assets. It\'s important to notify the right authorities and organizations.',
        actions: [
            'Document all details of the incident',
            'Contact your bank if financial information was compromised',
            'Report to your organization\'s IT department',
            'File a report with law enforcement',
            'Notify relevant government agencies'
        ],
        checklist: [
            'Incident details documented (time, date, type of attack)',
            'Screenshots taken of suspicious emails/messages',
            'Bank/credit card companies notified',
            'Police report filed',
            'IT department informed',
            'Identity theft report submitted',
            'Fraud alerts placed on credit reports',
            'Relevant regulatory bodies notified',
            'Insurance company contacted if applicable',
            'Coworkers/contacts warned about potential spread'
        ],
        resources: [
            'Federal Trade Commission (FTC) Identity Theft website',
            'Internet Crime Complaint Center (IC3)',
            'Local law enforcement cybercrime unit',
            'Credit reporting agencies',
            'Company IT security guidelines'
        ],
        timeline: [
            'Immediately: Document all incident details',
            'Within 1 hour: Contact financial institutions',
            'Within 24 hours: File official reports',
            'Within 48 hours: Set up fraud alerts',
            'Within 1 week: Follow up on all reports'
        ]
    },
    'monitor': {
        title: 'Monitor Your Accounts',
        icon: 'fas fa-chart-line',
        description: 'After a phishing attack, careful monitoring of your accounts is essential to detect and prevent unauthorized access or suspicious activities.',
        actions: [
            'Review all recent account activity',
            'Check for unauthorized transactions',
            'Monitor email account for suspicious forwards',
            'Watch for unusual login locations',
            'Set up activity alerts'
        ],
        checklist: [
            'Bank statements reviewed',
            'Credit card activity checked',
            'Email settings and filters inspected',
            'Social media activity verified',
            'Login history checked on all accounts',
            'Account recovery options verified',
            'Automatic payments reviewed',
            'Connected apps and services audited',
            'Credit reports monitored',
            'Account notifications enabled'
        ],
        resources: [
            'Credit monitoring services',
            'Banking apps with real-time alerts',
            'Account activity monitoring tools',
            'Identity theft protection services',
            'Security logging platforms'
        ],
        timeline: [
            'Immediately: Check all critical accounts',
            'Daily: Monitor financial transactions',
            'Weekly: Review account access logs',
            'Monthly: Check credit reports',
            'Ongoing: Maintain regular monitoring'
        ]
    },
    'prevent': {
        title: 'Prevent Future Attacks',
        icon: 'fas fa-shield-alt',
        description: 'Taking preventive measures after an attack is crucial to strengthen your security posture and prevent future incidents.',
        actions: [
            'Review and update security settings',
            'Install/update security software',
            'Educate yourself about latest threats',
            'Back up important data',
            'Create an incident response plan'
        ],
        checklist: [
            'Security software installed/updated',
            'Email filters configured',
            'Recovery options updated',
            'Security training completed',
            'Backup system implemented',
            'Device security settings reviewed',
            'Browser security enhanced',
            'Network security improved',
            'Mobile device security updated',
            'Security awareness training scheduled'
        ],
        resources: [
            'Antivirus software providers',
            'Security awareness training platforms',
            'Data backup solutions',
            'Password managers',
            'Security configuration guides'
        ],
        timeline: [
            'Immediately: Update security software',
            'Within 24 hours: Configure security settings',
            'Within 1 week: Complete security training',
            'Within 1 month: Implement full security plan',
            'Ongoing: Regular security reviews'
        ]
    }
};

// Response Steps Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    const responseModal = document.getElementById('responseModal');
    const responseDetailsBtns = document.querySelectorAll('.response-details-btn');
    const responseCloseBtn = responseModal?.querySelector('.close-btn');

    function createChecklistItem(text) {
        return `
            <div class="checklist-item">
                <input type="checkbox" id="check-${text.toLowerCase().replace(/[^a-z0-9]/g, '-')}">
                <label>${text}</label>
            </div>
        `;
    }

    function openResponseModal(responseType) {
        const data = responseData[responseType];
        if (!data || !responseModal) return;

        // Update modal content
        responseModal.querySelector('.modal-icon').className = `modal-icon ${data.icon}`;
        responseModal.querySelector('.modal-title').textContent = data.title;
        responseModal.querySelector('.response-description').textContent = data.description;

        // Update lists
        const actionsList = responseModal.querySelector('.actions-list');
        const checklistItems = responseModal.querySelector('.checklist-items');
        const resourcesList = responseModal.querySelector('.resources-list');
        const timelineList = responseModal.querySelector('.timeline-list');

        actionsList.innerHTML = data.actions.map(action => `<li>${action}</li>`).join('');
        checklistItems.innerHTML = data.checklist.map(createChecklistItem).join('');
        resourcesList.innerHTML = data.resources.map(resource => `<li>${resource}</li>`).join('');
        timelineList.innerHTML = data.timeline.map((time, index) => `<li style="--index:${index + 1}">${time}</li>`).join('');

        // Show modal with animation
        responseModal.style.display = 'flex';
        setTimeout(() => {
            responseModal.classList.add('active');
            responseModal.querySelector('.modal-content').style.transform = 'translateY(0)';
        }, 10);
    }

    function closeResponseModal() {
        if (!responseModal) return;
        responseModal.classList.remove('active');
        responseModal.querySelector('.modal-content').style.transform = 'translateY(-50px)';
        setTimeout(() => {
            responseModal.style.display = 'none';
        }, 300);
    }

    // Event Listeners
    responseDetailsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const responseType = btn.closest('.response-card').getAttribute('data-response');
            openResponseModal(responseType);
        });
    });

    if (responseCloseBtn) {
        responseCloseBtn.addEventListener('click', closeResponseModal);
    }

    if (responseModal) {
        responseModal.addEventListener('click', (e) => {
            if (e.target === responseModal) {
                closeResponseModal();
            }
        });
    }

    // Keyboard accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && responseModal?.classList.contains('active')) {
            closeResponseModal();
        }
    });

    // Add hover effects for response cards
    const responseCards = document.querySelectorAll('.response-card');
    responseCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });

    // Save checklist state to localStorage
    const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    checklistItems.forEach(item => {
        const id = item.id;
        // Load saved state
        item.checked = localStorage.getItem(id) === 'true';

        item.addEventListener('change', () => {
            localStorage.setItem(id, item.checked);
        });
    });
});
