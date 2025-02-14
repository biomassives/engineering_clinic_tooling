export class StorageService {
  constructor() {
      this.configure();
  }

  configure() {
      localforage.config({
          name: 'approVideo',
          storeName: 'app_store',
          description: 'Local storage for ApproVideo'
      });
  }

  async get(key) {
      return await localforage.getItem(key);
  }

  async set(key, value) {
      return await localforage.setItem(key, value);
  }

  async remove(key) {
      return await localforage.removeItem(key);
  }

  async clear() {
      return await localforage.clear();
  }




  async getData(key) {
    console.log("getData called with key:", key);
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error("Error getting data from local storage:", error);
        return null;
    }
    }

async saveData(key, data) {
    console.log("saveData called with key:", key, "and data:", data);
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error("Error saving data to local storage:", error);
    }
    } 





}