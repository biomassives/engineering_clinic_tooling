// js/services/workshop.service.mjs
import { StorageService } from './storage.service.mjs';

export class WorkshopService {
  constructor() {
    this.storageService = new StorageService();
    this.WORKSHOP_KEY = 'workshops';
    this.PROGRESS_KEY = 'workshop_progress';
  }

  async getWorkshops(filters = {}) {
    try {
      let workshops = await this.storageService.getData(this.WORKSHOP_KEY) || [];
      
      // Apply filters if any
      if (filters.type) {
        workshops = workshops.filter(w => w.type === filters.type);
      }
      if (filters.level) {
        workshops = workshops.filter(w => w.level === filters.level);
      }
      
      return workshops;
    } catch (error) {
      console.error('Error fetching workshops:', error);
      throw error;
    }
  }

  async getWorkshopDetails(workshopId) {
    try {
      const workshops = await this.getWorkshops();
      const workshop = workshops.find(w => w.id === workshopId);
      
      if (!workshop) {
        throw new Error('Workshop not found');
      }
      
      // Fetch additional details if needed
      const details = await this.storageService.getData(`workshop_${workshopId}_details`);
      return { ...workshop, ...details };
    } catch (error) {
      console.error('Error fetching workshop details:', error);
      throw error;
    }
  }

  async getUserProgress(userId = 'current_user') {
    try {
      const progressKey = `${this.PROGRESS_KEY}_${userId}`;
      return await this.storageService.getData(progressKey) || {};
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }

  async startModule(workshopId, moduleId, userId = 'current_user') {
    try {
      const progressKey = `${this.PROGRESS_KEY}_${userId}`;
      let progress = await this.getUserProgress(userId);
      
      // Initialize workshop progress if not exists
      if (!progress[workshopId]) {
        progress[workshopId] = {
          startedAt: new Date().toISOString(),
          completedModules: [],
          currentModule: moduleId,
          lastAccessed: new Date().toISOString()
        };
      } else {
        progress[workshopId].currentModule = moduleId;
        progress[workshopId].lastAccessed = new Date().toISOString();
      }
      
      await this.storageService.saveData(progressKey, progress);
      return progress[workshopId];
    } catch (error) {
      console.error('Error starting module:', error);
      throw error;
    }
  }

  async completeModule(workshopId, moduleId, userId = 'current_user') {
    try {
      const progressKey = `${this.PROGRESS_KEY}_${userId}`;
      let progress = await this.getUserProgress(userId);
      
      if (!progress[workshopId]) {
        throw new Error('Workshop progress not found');
      }
      
      if (!progress[workshopId].completedModules.includes(moduleId)) {
        progress[workshopId].completedModules.push(moduleId);
        progress[workshopId].lastAccessed = new Date().toISOString();
      }
      
      await this.storageService.saveData(progressKey, progress);
      return progress[workshopId];
    } catch (error) {
      console.error('Error completing module:', error);
      throw error;
    }
  }

  async saveModuleProgress(workshopId, moduleId, data, userId = 'current_user') {
    try {
      const progressKey = `${this.PROGRESS_KEY}_${userId}`;
      let progress = await this.getUserProgress(userId);
      
      if (!progress[workshopId]) {
        progress[workshopId] = {
          startedAt: new Date().toISOString(),
          completedModules: [],
          moduleProgress: {}
        };
      }
      
      if (!progress[workshopId].moduleProgress) {
        progress[workshopId].moduleProgress = {};
      }
      
      progress[workshopId].moduleProgress[moduleId] = {
        ...progress[workshopId].moduleProgress[moduleId],
        ...data,
