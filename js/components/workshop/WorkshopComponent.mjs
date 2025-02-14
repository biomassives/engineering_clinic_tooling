// js/components/workshop/WorkshopComponent.mjs
import { WorkshopService } from '../../services/workshop.service.mjs';

export class WorkshopComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.workshopService = new WorkshopService();
    this.currentWorkshop = null;
    this.userProgress = {};
    
    this.init();
  }

  async init() {
    try {
      await this.loadWorkshops();
      this.render();
      this.attachEventListeners();
    } catch (error) {
      console.error('Error initializing workshop component:', error);
      this.showError('Failed to load workshops');
    }
  }

  async loadWorkshops() {
    try {
      this.workshops = await this.workshopService.getWorkshops();
      this.userProgress = await this.workshopService.getUserProgress();
    } catch (error) {
      console.error('Error loading workshops:', error);
      throw error;
    }
  }

  render() {
    const html = `
      <div class="workshop-container">
        <div class="workshop-header">
          <h2>Available Workshops</h2>
          <div class="workshop-filters">
            <select id="workshopTypeFilter">
              <option value="">All Types</option>
              <option value="technical">Technical</option>
              <option value="design">Design</option>
              <option value="implementation">Implementation</option>
            </select>
            <select id="workshopLevelFilter">
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
        
        <div class="workshop-grid">
          ${this.renderWorkshopList()}
        </div>
        
        <div id="workshopDetail" class="workshop-detail" style="display: none;">
          ${this.currentWorkshop ? this.renderWorkshopDetail() : ''}
        </div>
      </div>
    `;
    
    this.container.innerHTML = html;
  }

  renderWorkshopList() {
    if (!this.workshops || !this.workshops.length) {
      return '<p>No workshops available at the moment.</p>';
    }

    return this.workshops.map(workshop => `
      <div class="workshop-card" data-workshop-id="${workshop.id}">
        <div class="workshop-card-header">
          <h3>${workshop.title}</h3>
          <span class="workshop-level ${workshop.level}">${workshop.level}</span>
        </div>
        <div class="workshop-card-body">
          <p>${workshop.description}</p>
          <div class="workshop-meta">
            <span>${workshop.duration}</span>
            <span>${workshop.participants} participants</span>
          </div>
        </div>
        <div class="workshop-card-footer">
          <div class="progress-bar">
            <div class="progress" style="width: ${this.calculateProgress(workshop.id)}%"></div>
          </div>
          <button class="btn-join" data-workshop-id="${workshop.id}">
            ${this.userProgress[workshop.id] ? 'Continue' : 'Join Workshop'}
          </button>
        </div>
      </div>
    `).join('');
  }

  renderWorkshopDetail() {
    if (!this.currentWorkshop) return '';
    
    return `
      <div class="workshop-detail-content">
        <button class="btn-close" id="closeWorkshopDetail">&times;</button>
        <h2>${this.currentWorkshop.title}</h2>
        
        <div class="workshop-info">
          <div class="workshop-meta">
            <span>Duration: ${this.currentWorkshop.duration}</span>
            <span>Level: ${this.currentWorkshop.level}</span>
            <span>Participants: ${this.currentWorkshop.participants}</span>
          </div>
          
          <div class="workshop-description">
            ${this.currentWorkshop.description}
          </div>
          
          <div class="workshop-modules">
            ${this.renderModules()}
          </div>
        </div>
      </div>
    `;
  }

  renderModules() {
    return this.currentWorkshop.modules.map((module, index) => `
      <div class="module-card ${this.isModuleCompleted(module.id) ? 'completed' : ''}">
        <div class="module-header">
          <h4>Module ${index + 1}: ${module.title}</h4>
          ${this.isModuleCompleted(module.id) 
            ? '<span class="completion-badge">✓</span>' 
            : ''}
        </div>
        <div class="module-content">
          <p>${module.description}</p>
          <button class="btn-start-module" 
                  data-module-id="${module.id}"
                  ${this.isModuleLocked(module.id) ? 'disabled' : ''}>
            ${this.getModuleButtonText(module.id)}
          </button>
        </div>
      </div>
    `).join('');
  }

  calculateProgress(workshopId) {
    const progress = this.userProgress[workshopId];
    if (!progress) return 0;
    
    const workshop = this.workshops.find(w => w.id === workshopId);
    if (!workshop) return 0;
    
    return (progress.completedModules.length / workshop.modules.length) * 100;
  }

  isModuleCompleted(moduleId) {
    if (!this.currentWorkshop || !this.userProgress[this.currentWorkshop.id]) {
      return false;
    }
    return this.userProgress[this.currentWorkshop.id].completedModules.includes(moduleId);
  }

  isModuleLocked(moduleId) {
    if (!this.currentWorkshop) return true;
    
    const moduleIndex = this.currentWorkshop.modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === 0) return false;
    
    const previousModule = this.currentWorkshop.modules[moduleIndex - 1];
    return !this.isModuleCompleted(previousModule.id);
  }

  getModuleButtonText(moduleId) {
    if (this.isModuleCompleted(moduleId)) return 'Review';
    if (this.isModuleLocked(moduleId)) return 'Locked';
    return 'Start';
  }

  attachEventListeners() {
    // Workshop card clicks
    this.container.querySelectorAll('.workshop-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const workshopId = e.currentTarget.dataset.workshopId;
        this.showWorkshopDetail(workshopId);
      });
    });

    // Filter changes
    const typeFilter = this.container.querySelector('#workshopTypeFilter');
    const levelFilter = this.container.querySelector('#workshopLevelFilter');
    
    if (typeFilter) {
      typeFilter.addEventListener('change', () => this.applyFilters());
    }
    
    if (levelFilter) {
      levelFilter.addEventListener('change', () => this.applyFilters());
    }

    // Close detail view
    const closeBtn = this.container.querySelector('#closeWorkshopDetail');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideWorkshopDetail());
    }

    // Module interactions
    this.container.querySelectorAll('.btn-start-module').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const moduleId = e.target.dataset.moduleId;
        this.startModule(moduleId);
      });
    });
  }

  async showWorkshopDetail(workshopId) {
    try {
      this.currentWorkshop = await this.workshopService.getWorkshopDetails(workshopId);
      const detailElement = this.container.querySelector('#workshopDetail');
      if (detailElement) {
        detailElement.innerHTML = this.renderWorkshopDetail();
        detailElement.style.display = 'block';
        this.attachEventListeners();
      }
    } catch (error) {
      console.error('Error loading workshop details:', error);
      this.showError('Failed to load workshop details');
    }
  }

  hideWorkshopDetail() {
    const detailElement = this.container.querySelector('#workshopDetail');
    if (detailElement) {
      detailElement.style.display = 'none';
    }
    this.currentWorkshop = null;
  }

  async applyFilters() {
    const typeFilter = this.container.querySelector('#workshopTypeFilter').value;
    const levelFilter = this.container.querySelector('#workshopLevelFilter').value;
    
    try {
      this.workshops = await this.workshopService.getWorkshops({
        type: typeFilter,
        level: levelFilter
      });
      
      const gridElement = this.container.querySelector('.workshop-grid');
      if (gridElement) {
        gridElement.innerHTML = this.renderWorkshopList();
        this.attachEventListeners();
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      this.showError('Failed to filter workshops');
    }
  }

  async startModule(moduleId) {
    if (this.isModuleLocked(moduleId)) return;
    
    try {
      await this.workshopService.startModule(this.currentWorkshop.id, moduleId);
      // Navigate to module content or show module interface
      this.showModuleContent(moduleId);
    } catch (error) {
      console.error('Error starting module:', error);
      this.showError('Failed to start module');
    }
  }

  showModuleContent(moduleId) {
    // Implementation for showing module content
    // This could navigate to a new view or open a modal
    console.log('Showing module content:', moduleId);
  }

  showError(message) {
    // Implementation for showing error messages to the user
    console.error(message);
  }
}
