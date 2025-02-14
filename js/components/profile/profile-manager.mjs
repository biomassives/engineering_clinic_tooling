//
//   js/components/profile/profile-manager.mjs
// 

import { getCurrentLang, translations } from '../../utils/translations.mjs';

export class ProfileManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('Container not found:', containerId);
      throw new Error('Container element not found');
    }
    this.activeTab = 'profile';
    this.currentLang = getCurrentLang(); // Store the language

    this.init();
  }

  async init() {
    try {
      await this.loadProfileData();
      this.render();
      this.attachEventListeners();
    } catch (error) {
      console.error('Error initializing profile manager:', error);
    }
  }

  async loadProfileData() {
    try {
      this.profileData = await localforage.getItem('userProfile') || {
        // Personal Info
        fullName: '',
        email: '',
        phone: '',
        organization: '',
        role: '',
        bio: '',
        
        // Clinics
        preferredClinics: [],
        clinicAvailability: '',
        expertiseLevel: '',
        
        // Learning
        learningMethods: [],
        currentCourses: [],
        learningGoals: '',
        
        // Community
        mentorshipInterest: false,
        contributionAreas: [],
        projectIdeas: ''
      };
    } catch (error) {
      console.error('Error loading profile data:', error);
      this.profileData = {};
    }
  }

  render() {
    const lang = this.currentLang || 'en';
    const html = `
      <div class="profile-manager">
        <div class="profile-tabs">
          <button class="tab-btn active" data-tab="profile">${translations[lang].profileTab}</button>
          <button class="tab-btn" data-tab="clinics">${translations[lang].clinicsTab}</button>
          <button class="tab-btn" data-tab="learning">${translations[lang].learningTab}</button>
          <button class="tab-btn" data-tab="community">${translations[lang].communityTab}</button>
        </div>
        <form id="profileForm" class="profile-form">
          <div id="profileTab" class="tab-content active">
            <!-- Profile tab content will be injected here -->
          </div>
          <div id="clinicsTab" class="tab-content" style="display: none;">
            <!-- Clinics tab content -->
          </div>
          <div id="learningTab" class="tab-content" style="display: none;">
            <!-- Learning tab content -->
          </div>
          <div id="communityTab" class="tab-content" style="display: none;">
            <!-- Community tab content -->
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">${translations[lang].saveChanges}</button>
          </div>
        </form>
        <div id="saveMessage" class="save-message" style="display: none;"></div>
      </div>
    `;
    this.container.innerHTML = html;
    this.renderTabs();
  }

  renderTabs() {
    const profileTab = document.getElementById('profileTab');
    const clinicsTab = document.getElementById('clinicsTab');
    const learningTab = document.getElementById('learningTab');
    const communityTab = document.getElementById('communityTab');

    if (profileTab) profileTab.innerHTML = this.createProfileTabHTML();
    if (clinicsTab) clinicsTab.innerHTML = this.createClinicsTabHTML();
    if (learningTab) learningTab.innerHTML = this.createLearningTabHTML();
    if (communityTab) communityTab.innerHTML = this.createCommunityTabHTML();
  }

  createProfileTabHTML() {
    const lang = this.currentLang || 'en';
    return `
      <div class="tab-section">
        <h3 class="text-lg font-semibold mb-4">${translations[lang].profileBasicInfoTitle}</h3>
        <div class="form-grid">
          <div class="form-group">
            <label for="fullName">${translations[lang].profileFullName}</label>
            <input type="text" id="fullName" name="fullName" 
              value="${this.profileData.fullName || ''}" class="w-full p-2 border rounded" />
          </div>
          <div class="form-group">
            <label for="email">${translations[lang].profileEmail}</label>
            <input type="email" id="email" name="email" 
              value="${this.profileData.email || ''}" class="w-full p-2 border rounded" />
          </div>
          <div class="form-group">
            <label for="phone">${translations[lang].profilePhone}</label>
            <input type="tel" id="phone" name="phone" 
              value="${this.profileData.phone || ''}" class="w-full p-2 border rounded" />
          </div>
          <div class="form-group">
            <label for="organization">${translations[lang].profileOrganization}</label>
            <input type="text" id="organization" name="organization" 
              value="${this.profileData.organization || ''}" class="w-full p-2 border rounded" />
          </div>
          <div class="form-group">
            <label for="role">${translations[lang].profileRole}</label>
            <select id="role" name="role" class="w-full p-2 border rounded">
              <option value="">${translations[lang].selectRole}</option>
              <option value="student" ${this.profileData.role === 'student' ? 'selected' : ''}>${translations[lang].roleStudent}</option>
              <option value="professional" ${this.profileData.role === 'professional' ? 'selected' : ''}>${translations[lang].roleProfessional}</option>
              <option value="researcher" ${this.profileData.role === 'researcher' ? 'selected' : ''}>${translations[lang].roleResearcher}</option>
              <option value="educator" ${this.profileData.role === 'educator' ? 'selected' : ''}>${translations[lang].roleEducator}</option>
            </select>
          </div>
        </div>
        <div class="form-group mt-4">
          <label for="bio">${translations[lang].profileBio}</label>
          <textarea id="bio" name="bio" rows="4" 
            class="w-full p-2 border rounded">${this.profileData.bio || ''}</textarea>
        </div>
      </div>
    `;
  }

  createClinicsTabHTML() {
    const lang = this.currentLang || 'en';  // Add if not already present

    return `
      <div class="tab-section">
        <h3 class="text-lg font-semibold mb-4">Clinic Preferences</h3>
        <div class="form-group">
          <label class="block mb-2">Areas of Interest</label>
          <div class="checkbox-group">
            ${['Water Systems', 'Energy Solutions', 'Waste Management', 'Health Tech', 'Urban Agriculture']
              .map(clinic => `
                <label class="checkbox-label">
                  <input type="checkbox" name="preferredClinics" value="${clinic}" 
                    ${(this.profileData.preferredClinics || []).includes(clinic) ? 'checked' : ''}>
                  ${clinic}
                </label>
              `).join('')}
          </div>
        </div>
        <div class="form-group mt-4">
          <label for="clinicAvailability">Your Availability</label>
          <select id="clinicAvailability" name="clinicAvailability" class="w-full p-2 border rounded">
            <option value="">Select Availability</option>
            <option value="weekends" ${this.profileData.clinicAvailability === 'weekends' ? 'selected' : ''}>Weekends</option>
            <option value="weekday-evenings" ${this.profileData.clinicAvailability === 'weekday-evenings' ? 'selected' : ''}>Weekday Evenings</option>
            <option value="weekday-mornings" ${this.profileData.clinicAvailability === 'weekday-mornings' ? 'selected' : ''}>Weekday Mornings</option>
          </select>
        </div>
        <div class="form-group mt-4">
          <label for="expertiseLevel">Expertise Level</label>
          <select id="expertiseLevel" name="expertiseLevel" class="w-full p-2 border rounded">
            <option value="">Select Level</option>
            <option value="beginner" ${this.profileData.expertiseLevel === 'beginner' ? 'selected' : ''}>Beginner</option>
            <option value="intermediate" ${this.profileData.expertiseLevel === 'intermediate' ? 'selected' : ''}>Intermediate</option>
            <option value="advanced" ${this.profileData.expertiseLevel === 'advanced' ? 'selected' : ''}>Advanced</option>
          </select>
        </div>
      </div>
    `;
  }

  createLearningTabHTML() {
    const lang = this.currentLang || 'en';  // Add if not already present

    return `
      <div class="tab-section">
        <h3 class="text-lg font-semibold mb-4">Learning Preferences</h3>
        <div class="form-group">
          <label class="block mb-2">Preferred Learning Methods</label>
          <div class="checkbox-group">
            ${['Video Tutorials', 'Written Guides', 'Live Workshops', 'Hands-on Projects']
              .map(method => `
                <label class="checkbox-label">
                  <input type="checkbox" name="learningMethods" value="${method}"
                    ${(this.profileData.learningMethods || []).includes(method) ? 'checked' : ''}>
                  ${method}
                </label>
              `).join('')}
          </div>
        </div>
        <div class="form-group mt-4">
          <label for="currentCourses">Current Courses</label>
          <textarea id="currentCourses" name="currentCourses" rows="2" 
            class="w-full p-2 border rounded"
            placeholder="List your current courses">${(this.profileData.currentCourses || []).join('\n')}</textarea>
        </div>
        <div class="form-group mt-4">
          <label for="learningGoals">Learning Goals</label>
          <textarea id="learningGoals" name="learningGoals" rows="3" 
            class="w-full p-2 border rounded"
            placeholder="What do you want to achieve?">${this.profileData.learningGoals || ''}</textarea>
        </div>
      </div>
    `;
  }

  createCommunityTabHTML() {
    const lang = this.currentLang || 'en';  // Add if not already present

    return `
      <div class="tab-section">
        <h3 class="text-lg font-semibold mb-4">Community Engagement</h3>
        <div class="form-group">
          <label class="checkbox-label mb-4">
            <input type="checkbox" name="mentorshipInterest"
              ${this.profileData.mentorshipInterest ? 'checked' : ''}>
            Interested in mentoring others
          </label>
        </div>
        <div class="form-group">
          <label class="block mb-2">Areas of Contribution</label>
          <div class="checkbox-group">
            ${['Research', 'Teaching', 'Content Creation', 'Technical Support']
              .map(area => `
                <label class="checkbox-label">
                  <input type="checkbox" name="contributionAreas" value="${area}"
                    ${(this.profileData.contributionAreas || []).includes(area) ? 'checked' : ''}>
                  ${area}
                </label>
              `).join('')}
          </div>
        </div>
        <div class="form-group mt-4">
          <label for="projectIdeas">Project Ideas</label>
          <textarea id="projectIdeas" name="projectIdeas" rows="3" 
            class="w-full p-2 border rounded"
            placeholder="Share your ideas for community projects">${this.profileData.projectIdeas || ''}</textarea>
        </div>
      </div>
    `;
  }

  async saveProfile() {
    const form = this.container.querySelector('#profileForm');
    const formData = new FormData(form);
    const updatedData = {...this.profileData};
    const currentUserEmail = localStorage.getItem('currentUser');
    const profileKey = `profile_${currentUserEmail}`;
    
    // Handle checkbox groups for each tab
    const checkboxGroups = {
      preferredClinics: [],
      learningMethods: [],
      contributionAreas: []
    };

    // Clear existing arrays for checkbox groups
    Object.keys(checkboxGroups).forEach(group => {
      updatedData[group] = [];
    });

    // Process form data
    for (let [key, value] of formData.entries()) {
      if (key in checkboxGroups) {
        updatedData[key].push(value);
      } else {
        updatedData[key] = value;
      }
    }

    // Handle special boolean fields
    updatedData.mentorshipInterest = form.querySelector('[name="mentorshipInterest"]')?.checked || false;

    try {
      await localforage.setItem(profileKey, updatedData);
      this.profileData = updatedData;
      this.showSaveMessage('Profile saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving profile:', error);
      this.showSaveMessage('Error saving profile. Please try again.', 'error');
    }
  }

  attachEventListeners() {
    // Tab switching
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        this.switchTab(tabName);
      });
    });

    // Form submission
    const form = this.container.querySelector('#profileForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.saveProfile();
      });
    }
  }

  switchTab(tabName) {
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    this.container.querySelectorAll('.tab-content').forEach(content => {
      content.style.display = content.id === `${tabName}Tab` ? 'block' : 'none';
    });

    this.activeTab = tabName;
  }

  showSaveMessage(message, type) {
    const messageEl = this.container.querySelector('#saveMessage');
    if (messageEl) {
      messageEl.textContent = message;
      messageEl.className = `save-message ${type}`;
      messageEl.style.display = 'block';

      setTimeout(() => {
        messageEl.style.display = 'none';
      }, 3000);
    }
  }
}

export default ProfileManager;