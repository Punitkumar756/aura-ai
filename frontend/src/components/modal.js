/**
 * Modal Component
 */

const Modal = {
    /**
     * Show modal with content
     */
    show(content) {
        const modal = document.getElementById('failure-modal');
        const body = document.getElementById('modal-body');
        
        if (typeof content === 'string') {
            body.innerHTML = content;
        } else {
            body.appendChild(content);
        }
        
        modal.classList.add('active');
    },

    /**
     * Hide modal
     */
    hide() {
        const modal = document.getElementById('failure-modal');
        modal.classList.remove('active');
    },
};

// Close modal when clicking outside or on close button
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('failure-modal');
    const closeBtn = document.querySelector('.modal-close');

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                Modal.hide();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            Modal.hide();
        });
    }
});
