// login.mjs
export class Login {

    constructor(onLoginSuccess, authService) {
        this.onLoginSuccess = onLoginSuccess;
        this.authService = authService; // Assign authService
        this.init();
    }

    init() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin(e);
            });
        }
    }


    async handleLogin(e) {
        e.preventDefault();
        const email = this.loginEmail.value;
        const password = this.loginPassword.value;
    
        // FOR TESTING ONLY: Allow admin@admin.com / admin
        if (email === "admin@admin.com" && password === "admin") {
            this.setAuthToken("admin_token"); // Replace with a proper token if you have one
            this.showDashboard();
            return;
        }
    
        try {
            const result = await this.authService.login(email, password);
            if (this.onLoginSuccess) {
                this.onLoginSuccess(result);
            }
        } catch (error) {
            alert('Login failed');
            this.displayErrorMessage("Invalid credentials");
            console.log("Invalid credentials");
        
        }
    }
}