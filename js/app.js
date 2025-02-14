// /js/app.js
/*
const DEBUG = true;
if (DEBUG) {
    console.log({
        message: 'Error details',
        error: error,
        file: error.fileName,
        line: error.lineNumber,
        stack: error.stack
    });
}
*/
import { AuthService } from './services/auth.service.mjs';
import { StorageService } from './services/storage.service.mjs';
import { getCurrentLang } from './utils/translations.mjs';
import { ProfileManager } from './components/profile/profile-manager.mjs';
import { ForumService } from './services/forum.service.mjs';
import { ForumComponent } from './components/forum/ForumComponent.mjs';
import { Login } from './components/auth/login.mjs';
import { Register } from './components/auth/register.mjs';
import { supabase } from './services/supabase.js';


class App {
    constructor() {


        this.loginForm = document.querySelector("#loginForm");
        this.registerForm = document.querySelector("#registerForm");
        this.dashboard = document.querySelector("#dashboard");
        this.profileName = document.querySelector("#profileName");
        this.profileEmail = document.querySelector("#profileEmail");
        this.loginEmail = document.querySelector("#loginEmail");
        this.loginPassword = document.querySelector("#loginPassword");
        this.registerName = document.querySelector("#registerName");
        this.registerEmail = document.querySelector("#registerEmail");
        this.registerPassword = document.querySelector("#registerPassword");
        this.errorMessage = document.querySelector("#errorMessage");
    
        this.profileManager = null; // Initialize as null
        this.workshopComponent = null; // for projects' clinic
        this.forumComponent = null;

        this.storageService = new StorageService();
        this.forumService = new ForumService(this.storageService); // Instantiate ForumService

        this.currentUser = null;
        this.init();
    }

    async init() {
        try {
            await this.checkAuth();
            await this.forumService.initialize(); // Call ForumService.initialize()
            this.attachEventListeners();
            this.initializeUI();


            // Example: Seed a post for testing
            await this.forumService.createPost({
                title: "Test Post",
                content: "This is a test.",
                author: "Tester",
                category: "TEST" // Note: even if this category is not predefined, it will be stored
            });

        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    initializeUI() {
        // Theme initialization
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);

        // Language initialization
        const lang = localStorage.getItem('language') || 'en';
        document.documentElement.setAttribute('lang', lang);

        // Mobile menu setup
        this.initMobileMenu();
        // Theme toggle setup
        this.initThemeToggle();
        // Language selector setup
        this.initLanguageSelector();

        
    }

    showClinics(e) {
        e.preventDefault();
        console.log("Projects' Clinic link clicked");
    
        this.hideAllSections(); // Hide other sections
    
        const clinicsContainer = document.getElementById('clinicsContainer');
        if (!clinicsContainer) {
            console.error("Clinics container not found!");
            return;
        }
        clinicsContainer.style.display = 'block'; // Show the clinics container
    
        // Initialize WorkshopComponent in clinicsContainer if needed
        if (!this.workshopComponent) {
            this.workshopComponent = new WorkshopComponent('clinicsContainer');
        } else {
            // Optionally refresh the view
            this.workshopComponent.init();
        }
    }
    
      hideAllSections() {
        // Hide all content sections (example implementation)
        const sections = document.querySelectorAll('.view-section');
        sections.forEach(section => section.style.display = 'none');
        // Alternatively, explicitly hide each container:
        // document.getElementById('dashboardView').style.display = 'none';
        // document.getElementById('profileManagementContainer').style.display = 'none';
        // document.getElementById('forumContainer').style.display = 'none';
        // document.getElementById('clinicsContainer').style.display = 'none';
        // document.getElementById('projectsContainer').style.display = 'none';
      }
    
    initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }
    }

    initLanguageSelector() {
        const langSelect = document.getElementById('languageBtn');
        if (langSelect) {
            langSelect.addEventListener('click', () => {
                const dropdown = document.getElementById('languageDropdown');
                if (dropdown) {
                    dropdown.classList.toggle('hidden');
                }
            });
        }
    }

    showProfileManagement(e) {
        e.preventDefault();
        console.log("Manage Profile link clicked");

        // Get the profile management container
        const profileManagementContainer = document.getElementById('profileManagementContainer');

        if (!profileManagementContainer) {
            console.error("Profile management container not found!");
            return;
        }
        // Initialize the ProfileManager if it doesn't already exist
        if (!this.profileManager) {
            try {
                this.profileManager = new ProfileManager('profileManagementContainer');
            } catch (error) {
                console.error("Error initializing ProfileManager:", error);
                return;
            }
        }
        profileManagementContainer.style.display = 'block';
        this.hideOtherSections('profileManagementContainer');
    }


    async renderForum() {
        const forumContainer = document.getElementById('forumContainer');
        if (!forumContainer) {
            console.error("Forum container not found!");
            return;
        }
    
        try {
            const posts = await this.forumService.getPosts(); // Get all posts
            let html = '<ul>';
            posts.forEach(post => {
                html += `
                    <li>
                        <h3>${post.title}</h3>
                        <p>${post.content}</p>
                        <p>Author: ${post.author}</p>
                        <p>Category: ${post.category}</p>
                    </li>
                `;
            });
            html += '</ul>';
            forumContainer.innerHTML = html;
        } catch (error) {
            console.error("Error rendering forum:", error);
            forumContainer.innerHTML = '<p>Error loading forum posts.</p>';
        }
    }



    hideAllSections() {
        const dashboardView = document.getElementById('dashboardView');
        const profileManagementContainer = document.getElementById('profileManagementContainer');
        const forumContainer = document.getElementById('forumContainer');
        const clinicsContainer = document.getElementById('clinicsContainer');
        const projectsContainer = document.getElementById('projectsContainer');
    
        if (dashboardView) dashboardView.style.display = 'none';
        if (profileManagementContainer) profileManagementContainer.style.display = 'none';
        if (forumContainer) forumContainer.style.display = 'none';
        if (clinicsContainer) clinicsContainer.style.display = 'none';
        if (projectsContainer) projectsContainer.style.display = 'none';
    }


    hideOtherSections(sectionId) {
        const dashboardView = document.getElementById('dashboardView');
        const profileManagementContainer = document.getElementById('profileManagementContainer');
        const forumContainer = document.getElementById('forumContainer'); // Add other containers
    
        if (dashboardView && sectionId !== 'dashboardView') dashboardView.style.display = 'none';
        if (profileManagementContainer && sectionId !== 'profileManagementContainer') profileManagementContainer.style.display = 'none';
        if (forumContainer && sectionId !== 'forumContainer') forumContainer.style.display = 'none'; // Add other containers
    }



    setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    
    getItem(key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }
    
    removeItem(key) {
        localStorage.removeItem(key);
    }

    async checkAuth() {
        try {
            const session = await this.storageService.get('currentSession');
            if (session && session.user) {
                this.currentUser = session.user;
                this.showDashboard();
            } else {
                this.showLogin();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            this.showLogin();
        }
    }

    showLogin() {
        const loginView = document.getElementById('loginView');
        const dashboardView = document.getElementById('dashboardView');
        if (loginView) loginView.style.display = 'block';
        if (dashboardView) dashboardView.style.display = 'none';
    }

    showDashboard() {
        const loginView = document.getElementById('loginView');
        const dashboardView = document.getElementById('dashboardView');
        const sidebar = document.getElementById('sidebarView');

        if (loginView) loginView.style.display = "none"
        if (dashboardView) dashboardView.style.display = 'block';
        if (sidebar) sidebar.style.display = 'block';
    }

    attachEventListeners() {
        this.loginForm.addEventListener("submit", (e) => this.handleLogin(e));
        this.registerForm.addEventListener("submit", (e) => this.handleRegistration(e));
        // Add event listeners for the navigation links
        const profileManagementLink = document.getElementById('profileManagementLink');
        const forumLink = document.getElementById('forumLink');
        if (forumLink) {
          forumLink.addEventListener('click', (e) => this.showForum(e));
        }
        const clinicsLink = document.getElementById('clinicsLink');
        const projectsLink = document.getElementById('projectsLink');
        if (profileManagementLink) {
            profileManagementLink.addEventListener('click', (e) => this.showProfileManagement(e));
        }
        if (forumLink) {
            forumLink.addEventListener('click', (e) => this.showForum(e));
        }
        if (clinicsLink) {
            clinicsLink.addEventListener('click', (e) => this.showClinics(e));
        }
        if (projectsLink) {
            projectsLink.addEventListener('click', (e) => this.showProjects(e));
        }
    }    
    

    async handleLogin(e) {
        e.preventDefault();

        // Extract form data from the event object
        const formData = new FormData(this.loginForm);
        const email = formData.get("loginEmail"); // Replace "email" with the actual name of your email input field
        const password = formData.get("loginPassword"); // Replace "password" with the actual name of your password input field

        console.log("cred:"+email);
        console.log("credpass"+password);


        // 1. Check if the user exists in local storage
        const storedUser = this.getItem(`user_${email}`);

        if (storedUser) {
            // 2. If the user exists, compare the entered password with the stored password
            if (password === storedUser.password) { // **IMPORTANT: Replace with proper password hashing**
                // 3. If the credentials match, set the auth token and show the dashboard
                this.setAuthToken("local_auth_token"); // Replace with a more secure token
                this.showDashboard();
                return;
            }
        }


        // FOR TESTING ONLY: Allow admin@admin.com / admin
        if (email === "admin@admin.com" && password === "admin") {
            const user = {
                email: "admin@admin.com",
                name: "Administrator", // Add other user details as needed
            };
            this.setItem("user", user); // Store user data in local storage
            this.setAuthToken("admin_token"); // Replace with a proper token if you have one
            this.showDashboard();
            return;
        }

            // Regular login logic
            const user = await this.storageService.get(`user_${email}`);
            if (user && user.password === password) {
                this.currentUser = user;
                await this.storageService.set('currentSession', { user });
                this.showDashboard();
            } else {
         
            this.displayErrorMessage("Invalid credentials");
            console.log("Invalid credentials");
       
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    
    displayErrorMessage(message) {
        // Your error message display logic here
        console.error("Error:", message); // Example: Log the error to the console
    }

    showForum(e) {
        e.preventDefault();
        console.log("Community Forum link clicked");
    
        this.hideAllSections(); // Hide other sections
        const forumContainer = document.getElementById('forumContainer');
        if (!forumContainer) {
            console.error("Forum container not found!");
            return;
        }
        forumContainer.style.display = 'block'; // Show the forum container
    
        // Instantiate ForumComponent if not already done
        if (!this.forumComponent) {
            this.forumComponent = new ForumComponent('forumContainer');
        } else {
            // Optionally, reinitialize to refresh data/view
            this.forumComponent.init();
        }

        //this.renderForum(); // Render the forum posts
    }
    

    
    showProjects(e) {
        e.preventDefault();
        console.log("Project Profile link clicked");
        // Add your logic to display the project profile section
    }


    setAuthToken(token) {
        // Store the auth token in local storage
        localStorage.setItem("authToken", token);
        console.log("Auth token set:", token);
    }

}

    document.addEventListener("DOMContentLoaded", () => {
        const app = new App();
        app.init();
    });



console.log('App.js loaded successfully');