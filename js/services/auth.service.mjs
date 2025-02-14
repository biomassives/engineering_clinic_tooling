// /js/services/auth.service.mjs
import { supabase } from './supabase.js';

export class AuthService {
  constructor() {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.supabase = supabase;
    this.checkConnection();
  }

  async checkConnection() {
    try {
        await this.supabase.auth.getSession();
        console.log('Connected to Supabase');
    } catch (error) {
        console.error('Supabase connection error:', error);
    }
}

  isAdminUser(email, password) {
    return email === 'admin@admin.com' && password === 'admin';
  }

  async login(email, password) {
    try {
      if (this.isAdminUser(email, password)) { // Use isAdminUser here
        const userData = {
          name: 'Admin User',
          email: email,
          role: 'admin'
        };

  
        localStorage.setItem('userSession', JSON.stringify(userData));
        this.currentUser = userData;
        this.isAuthenticated = true;
        return userData;
      } else {
        // If not admin, throw an error (or handle non-admin login)
        throw new Error('Invalid credentials'); 
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }
  

  async logout() {
    try {
      localStorage.removeItem('userSession');
      this.currentUser = null;
      this.isAuthenticated = false;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  checkSession() {
    const session = localStorage.getItem('userSession');
    if (session) {
      this.currentUser = JSON.parse(session);
      this.isAuthenticated = true;
      return this.currentUser;
    }
    return null;
  }
}
