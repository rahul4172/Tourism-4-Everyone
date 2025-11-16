 let currentStep = 1;
        const totalSteps = 4;

        function updateProgress() {
            const progress = (currentStep / totalSteps) * 100;
            document.getElementById('progressFill').style.width = progress + '%';
            
            const stepElement = document.querySelector('.form-step');
            stepElement.textContent = `STEP ${currentStep} OF ${totalSteps}`;
        }

        function selectRadio(name, value, element) {
            // Clear previous selections
            const group = element.parentElement;
            group.querySelectorAll('.radio-item').forEach(item => {
                item.classList.remove('selected');
            });

            // Select current item
            element.classList.add('selected');
            element.querySelector('input[type="radio"]').checked = true;

            // Handle conditional logic
            handleConditionalLogic(name, value);
            
            // Update step based on selections
            updateCurrentStep();
            updateProgress();
        }

        function toggleCheckbox(element) {
            const checkbox = element.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            
            if (checkbox.checked) {
                element.classList.add('selected');
            } else {
                element.classList.remove('selected');
            }
        }

        function handleConditionalLogic(name, value) {
            if (name === 'needWebsite') {
                const websiteDetails = document.getElementById('websiteDetails');
                const websiteFeatures = document.getElementById('websiteFeatures');
                const alternativeServices = document.getElementById('alternativeServices');

                if (value === 'yes') {
                    // Show website-related fields
                    setTimeout(() => {
                        websiteDetails.classList.add('show');
                    }, 100);
                    setTimeout(() => {
                        websiteFeatures.classList.add('show');
                    }, 200);
                    
                    // Hide alternative services
                    alternativeServices.classList.remove('show');
                } else {
                    // Hide website-related fields
                    websiteDetails.classList.remove('show');
                    websiteFeatures.classList.remove('show');
                    
                    // Show alternative services
                    setTimeout(() => {
                        alternativeServices.classList.add('show');
                    }, 100);
                }
            }
        }

        function updateCurrentStep() {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const needWebsite = document.querySelector('input[name="needWebsite"]:checked');
            
            // Step 1: Basic info
            if (!name || !email) {
                currentStep = 1;
                return;
            }
            
            // Step 2: Website question
            if (!needWebsite) {
                currentStep = 2;
                return;
            }
            
            // Step 3: Website details or alternative services
            if (needWebsite.value === 'yes') {
                // For website path, we can go directly to step 4 after selection
                currentStep = 4;
            } else {
                // For non-website path, check if service type is selected
                const serviceType = document.querySelector('input[name="serviceType"]:checked');
                if (!serviceType) {
                    currentStep = 3;
                } else {
                    currentStep = 4;
                }
            }
        }

        function validateForm() {
            let isValid = true;
            
            // Clear previous errors
            document.querySelectorAll('.error-message').forEach(error => {
                error.classList.remove('show');
            });
            document.querySelectorAll('.error').forEach(field => {
                field.classList.remove('error');
            });

            // Validate required fields
            const requiredFields = [
                { id: 'name', message: 'Please enter your full name' },
                { id: 'email', message: 'Please enter a valid email address' },
            ];

            requiredFields.forEach(field => {
                const element = document.getElementById(field.id);
                const errorElement = document.getElementById(field.id + 'Error');
                
                if (!element.value.trim()) {
                    showError(element, errorElement, field.message);
                    isValid = false;
                }
            });

            // Validate email format
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value && !emailRegex.test(email.value)) {
                showError(email, document.getElementById('emailError'), 'Please enter a valid email address');
                isValid = false;
            }

            // Validate conditional required fields
            const needWebsite = document.querySelector('input[name="needWebsite"]:checked');
            if (!needWebsite) {
                showError(null, document.getElementById('needWebsiteError'), 'Please select if you need a website');
                isValid = false;
            } else if (needWebsite.value === 'no') {
                const serviceType = document.querySelector('input[name="serviceType"]:checked');
                if (!serviceType) {
                    showError(null, document.getElementById('alternativeServices').querySelector('.error-message') || document.createElement('div'), 'Please select a service type');
                    isValid = false;
                }
            }

            // Validate budget
            const budget = document.querySelector('input[name="budget"]:checked');
            if (!budget) {
                showError(null, document.getElementById('budgetError'), 'Please select your budget range');
                isValid = false;
            }

            // Validate timeline
            const timeline = document.getElementById('timeline');
            if (!timeline.value) {
                showError(timeline, document.getElementById('timelineError'), 'Please select your timeline');
                isValid = false;
            }

            return isValid;
        }

        function showError(element, errorElement, message) {
            if (element) {
                element.classList.add('error');
            }
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.add('show');
            }
        }

        // Form submission
        document.getElementById('projectForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                // Simulate form submission
                const submitBtn = document.querySelector('.submit-btn');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.textContent = '✓ Inquiry Sent Successfully!';
                    submitBtn.style.background = 'var(--success)';
                    
                    setTimeout(() => {
                        alert('Thank you! We\'ll be in touch within 24 hours.');
                        // Reset form
                        this.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                        
                        // Reset conditional sections
                        document.querySelectorAll('.conditional').forEach(section => {
                            section.classList.remove('show');
                        });
                        
                        // Reset selections
                        document.querySelectorAll('.selected').forEach(item => {
                            item.classList.remove('selected');
                        });
                        
                        currentStep = 1;
                        updateProgress();
                    }, 2000);
                }, 1500);
            }
        });

        // Initialize form animations
        document.addEventListener('DOMContentLoaded', function() {
            // Stagger form group animations
            const formGroups = document.querySelectorAll('.form-group:not(.conditional)');
            formGroups.forEach((group, index) => {
                group.style.animationDelay = `${0.4 + (index * 0.1)}s`;
            });
        });

        // Real-time validation and step updates
        document.getElementById('name').addEventListener('input', function() {
            updateCurrentStep();
            updateProgress();
        });

        document.getElementById('email').addEventListener('input', function() {
            updateCurrentStep();
            updateProgress();
        });

        document.getElementById('email').addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const errorElement = document.getElementById('emailError');
            
            if (this.value && !emailRegex.test(this.value)) {
                showError(this, errorElement, 'Please enter a valid email address');
            } else {
                this.classList.remove('error');
                errorElement.classList.remove('show');
            }
            
            updateCurrentStep();
            updateProgress();
        });

        // Initialize progress
        currentStep = 1;
        updateProgress();
