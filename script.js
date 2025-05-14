document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('multi-step-form');
    const steps = Array.from(form.querySelectorAll('.step'));
    const progressBar = document.querySelector('.progress-bar::before');
    const stepIndicators = Array.from(document.querySelectorAll('.step-indicator'));
    const prevBtns = form.querySelectorAll('.prev-btn');
    const nextBtns = form.querySelectorAll('.next-btn');
    const submitBtn = form.querySelector('.submit-btn');
    const summaryDiv = document.getElementById('summary');
    const summaryContent = document.getElementById('summary-content');
    const editBtn = form.querySelector('.edit-btn');
    const confirmBtn = form.querySelector('.confirm-btn');

    let currentStep = 0;

    function updateProgressBar() {
        const progress = ((currentStep + 1) / steps.length) * 100;
        progressBar.style.width = `${progress}%`;
        stepIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index <= currentStep);
        });
    }

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.remove('active');
            if (index === stepIndex) {
                step.classList.add('active');
            }
        });
        summaryDiv.classList.remove('active');
        updateProgressBar();
    }

    function validateCurrentStep() {
        const currentActiveStep = steps[currentStep];
        const requiredFields = currentActiveStep.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                // You could add visual error feedback here
            }
        });
        return isValid;
    }

    function showSummary() {
        let summaryHTML = '';
        steps.forEach(step => {
            const heading = step.querySelector('h2').textContent;
            summaryHTML += `<h3>${heading}</h3><ul>`;
            const inputs = step.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea, input[type="checkbox"]:checked');
            inputs.forEach(input => {
                const label = document.querySelector(`label[for="${input.id}"]`)?.textContent || input.name;
                const value = input.type === 'checkbox' ? 'Checked' : input.value;
                summaryHTML += `<li><strong>${label}:</strong> ${value}</li>`;
            });
            summaryHTML += '</ul>';
        });
        summaryContent.innerHTML = summaryHTML;
        steps.forEach(step => step.classList.remove('active'));
        summaryDiv.classList.add('active');
        updateProgressBar(); // Progress should be 100% on summary
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateCurrentStep()) {
                currentStep++;
                if (currentStep < steps.length) {
                    showStep(currentStep);
                } else {
                    showSummary();
                }
            } else {
                alert('Please fill in all required fields.');
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            showStep(currentStep);
        });
    });

    submitBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent actual form submission for this example
        if (validateCurrentStep()) {
            showSummary();
        } else {
            alert('Please fill in all required fields.');
        }
    });

    editBtn.addEventListener('click', () => {
        currentStep = steps.length - 1; // Go back to the last step
        showStep(currentStep);
    });

    confirmBtn.addEventListener('click', () => {
        alert('Form submitted successfully!');
        // In a real application, you would handle form submission here
    });

    // Initialize the form
    showStep(currentStep);
    updateProgressBar();
});