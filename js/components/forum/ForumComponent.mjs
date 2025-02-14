export class ForumComponent {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        throw new Error('Container element not found');
      }
      this.activeTab = 'recent';
      this.init();
    }
  
    async init() {
      try {
        await this.loadForumData();
        this.render();
        this.attachEventListeners();
      } catch (error) {
        console.error('Error initializing forum:', error);
      }
    }
  
    async loadForumData() {
      try {
        this.forumData = await localforage.getItem('forumData') || {
          posts: [],
          categories: [
            'water-systems',
            'energy-solutions',
            'waste-management',
            'health-tech',
            'urban-agriculture'
          ]
        };
      } catch (error) {
        console.error('Error loading forum data:', error);
        this.forumData = {};
      }
    }
  
    createForumHTML() {
      return `
        <div class="forum-container">
          <div class="forum-header">
            <h2 class="text-2xl font-bold mb-4">Community Forum</h2>
            <div class="tab-buttons">
              <button class="tab-btn ${this.activeTab === 'recent' ? 'active' : ''}" data-tab="recent">Recent Posts</button>
              <button class="tab-btn ${this.activeTab === 'popular' ? 'active' : ''}" data-tab="popular">Popular</button>
              <button class="tab-btn ${this.activeTab === 'my-posts' ? 'active' : ''}" data-tab="my-posts">My Posts</button>
            </div>
          </div>
          
          <div class="post-form-container mb-6">
            <form id="postForm" class="space-y-4">
              <input type="text" id="postTitle" name="title" placeholder="Post title" 
                     class="w-full p-2 border rounded" required>
              <select id="postCategory" name="category" class="w-full p-2 border rounded" required>
                <option value="">Select Category</option>
                ${this.forumData.categories.map(cat => 
                  `<option value="${cat}">${cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>`
                ).join('')}
              </select>
              <textarea id="postContent" name="content" rows="4" 
                       class="w-full p-2 border rounded" required
                       placeholder="Share your thoughts..."></textarea>
              <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">
                Create Post
              </button>
            </form>
          </div>
  
          <div class="posts-container space-y-6">
            ${this.renderPosts()}
          </div>
        </div>
      `;
    }
  
    renderPosts() {
      const posts = this.getSortedPosts();
      if (posts.length === 0) {
        return '<div class="text-center py-8 text-gray-500">No posts yet. Be the first to share!</div>';
      }
  
      return posts.map(post => `
        <div class="post bg-white p-6 rounded shadow" data-post-id="${post.id}">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-xl font-semibold">${post.title}</h3>
              <div class="text-sm text-gray-500 mt-1">
                <span>${post.author}</span>
                <span>•</span>
                <span>${new Date(post.timestamp).toLocaleDateString()}</span>
                <span>•</span>
                <span class="capitalize">${post.category.replace('-', ' ')}</span>
              </div>
            </div>
            <div class="flex space-x-4">
              <button class="like-btn flex items-center space-x-1" data-post-id="${post.id}">
                <span>👍</span>
                <span>${post.likes || 0}</span>
              </button>
            </div>
          </div>
          
          <p class="mt-4 text-gray-700">${post.content}</p>
          
          <div class="mt-4 space-y-4">
            ${this.renderReplies(post.replies || [])}
            <form class="reply-form mt-4">
              <input type="text" placeholder="Write a reply..."
                     class="w-full p-2 border rounded"
                     data-post-id="${post.id}">
            </form>
          </div>
        </div>
      `).join('');
    }
  
    renderReplies(replies) {
      if (!replies.length) return '';
      return replies.map(reply => `
        <div class="reply ml-8 p-3 bg-gray-50 rounded">
          <div class="flex justify-between items-start">
            <span class="font-medium">${reply.author}</span>
            <span class="text-sm text-gray-500">
              ${new Date(reply.timestamp).toLocaleDateString()}
            </span>
          </div>
          <p class="mt-1">${reply.content}</p>
        </div>
      `).join('');
    }
  
    getSortedPosts() {
      const posts = [...(this.forumData.posts || [])];
      switch (this.activeTab) {
        case 'popular':
          return posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        case 'my-posts':
          const currentUser = localStorage.getItem('currentUser');
          return posts.filter(post => post.author === currentUser);
        default: // recent
          return posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }
    }
  
    render() {
      this.container.innerHTML = this.createForumHTML();
    }
  
    attachEventListeners() {
      const form = this.container.querySelector('#postForm');
      if (form) {
        form.addEventListener('submit', this.handlePostSubmit.bind(this));
      }
  
      this.container.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.activeTab = e.target.dataset.tab;
          this.render();
          this.attachEventListeners();
        });
      });
  
      this.container.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', this.handleLike.bind(this));
      });
  
      this.container.querySelectorAll('.reply-form').forEach(form => {
        form.addEventListener('submit', this.handleReply.bind(this));
      });
    }
  
    async handlePostSubmit(e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      const currentUser = localStorage.getItem('currentUser');
  
      const newPost = {
        id: Date.now(),
        title: formData.get('title'),
        content: formData.get('content'),
        category: formData.get('category'),
        author: currentUser || 'Anonymous',
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: []
      };
  
      this.forumData.posts = [newPost, ...(this.forumData.posts || [])];
      await localforage.setItem('forumData', this.forumData);
      
      e.target.reset();
      this.render();
      this.attachEventListeners();
    }
  
    async handleLike(e) {
      const postId = parseInt(e.currentTarget.dataset.postId);
      const post = this.forumData.posts.find(p => p.id === postId);
      if (post) {
        post.likes = (post.likes || 0) + 1;
        await localforage.setItem('forumData', this.forumData);
        this.render();
        this.attachEventListeners();
      }
    }
  
    async handleReply(e) {
      e.preventDefault();
      const input = e.target.querySelector('input');
      const postId = parseInt(input.dataset.postId);
      const content = input.value.trim();
      
      if (!content) return;
  
      const post = this.forumData.posts.find(p => p.id === postId);
      if (post) {
        const currentUser = localStorage.getItem('currentUser');
        post.replies = [...(post.replies || []), {
          id: Date.now(),
          content,
          author: currentUser || 'Anonymous',
          timestamp: new Date().toISOString()
        }];
  
        await localforage.setItem('forumData', this.forumData);
        input.value = '';
        this.render();
        this.attachEventListeners();
      }
    }
  }
  
  export default ForumComponent;