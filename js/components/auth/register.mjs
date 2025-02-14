export class Register {

    constructor(onRegisterSuccess, authService) {
        this.onRegisterSuccess = onRegisterSuccess;
        this.authService = authService; // Assign authService
        this.init();
    }

    init() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRegistration(e);
            });
        }
    }

    async handleRegistration(e) {
        e.preventDefault();
        const registerName = document.getElementById('registerName').value;
        const registerEmail = document.getElementById('registerEmail').value;
        const registerPassword = document.getElementById('registerPassword').value;

        try {
            const result = await this.authService.register(registerName, registerEmail, registerPassword);
            if (this.onRegisterSuccess) {
                this.onRegisterSuccess(result);
            }
        } catch (error) {
            alert('Registration failed');
            // Consider a more user-friendly error display
            console.error("Registration failed:", error);
        }
    }
}