// /js/services/forum.service.mjs
export class ForumService {
  constructor(storageService) {
    this.storageService = storageService;
    this.STORAGE_KEY = 'forum_data';
  }

  async initialize() {
    const exists = await this.storageService.getData(this.STORAGE_KEY);
    if (!exists) {
      await this.storageService.saveData(this.STORAGE_KEY, {
        posts: [],
        categories: [
          'water-systems',
          'energy-solutions',
          'waste-management',
          'health-tech',
          'urban-agriculture'
        ]
      });
    }
  }

  async createPost(postData) {
    const data = await this.storageService.getData(this.STORAGE_KEY);
    const newPost = {
      id: Date.now(),
      title: postData.title,
      content: postData.content,
      author: postData.author,
      category: postData.category,
      likes: 0,
      views: 0,
      replies: [],
      timestamp: new Date().toISOString()
    };
    
    data.posts.unshift(newPost);
    await this.storageService.saveData(this.STORAGE_KEY, data);
    return newPost;
  }

  async getPosts(filters = {}) {
    const data = await this.storageService.getData(this.STORAGE_KEY);
    let posts = [...data.posts];

    if (filters.category) {
      posts = posts.filter(post => post.category === filters.category);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower)
      );
    }

    return posts;
  }

  async addReply(postId, replyData) {
    const data = await this.storageService.getData(this.STORAGE_KEY);
    const post = data.posts.find(p => p.id === postId);
    
    if (!post) throw new Error('Post not found');
    
    const newReply = {
      id: Date.now(),
      content: replyData.content,
      author: replyData.author,
      likes: 0,
      timestamp: new Date().toISOString()
    };
    
    post.replies.push(newReply);
    await this.storageService.saveData(this.STORAGE_KEY, data);
    return newReply;
  }

  async likePost(postId) {
    const data = await this.storageService.getData(this.STORAGE_KEY);
    const post = data.posts.find(p => p.id === postId);
    
    if (!post) throw new Error('Post not found');
    
    post.likes += 1;
    await this.storageService.saveData(this.STORAGE_KEY, data);
    return post.likes;
  }
}
