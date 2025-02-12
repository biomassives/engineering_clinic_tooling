# ApproVideo Development Guidelines

## Core Objectives
1. Progressive Enhancement Architecture
   - Local-first functionality with LocalForage
   - Optional Supabase integration
   - Maintain offline capabilities
   - Preserve user data integrity

2. User Authentication Flow
   - Support multiple authentication methods
   - Maintain dev access (admin@admin.com/admin)
   - Preserve user sessions across refreshes
   - Handle role-based access control

3. Module Structure
```javascript
/app
├── assets/
│   ├── css/
│   │   ├── main.css        # Core styles
│   │   ├── auth.css        # Authentication styles
│   │   ├── forum.css       # Forum component styles
│   │   ├── header.css      # Header component styles
│   │   └── profile.css     # Profile component styles
│   └── libs/
│       └── localforage.js  # Local storage library
├── js/
│   ├── services/
│   │   ├── auth.service.mjs    # Authentication service
│   │   ├── storage.service.mjs # Data persistence
│   │   ├── forum.service.mjs   # Forum functionality
│   │   └── supabase.mjs        # Supabase integration
│   └── app.js                  # Main application entry




You're absolutely right - I need to take a more holistic view of the codebase and maintain its objectives. Let me analyze the current state and create a proper guideline document.

```markdown
# ApproVideo Development Guidelines

## Core Objectives
1. Progressive Enhancement Architecture
   - Local-first functionality with LocalForage
   - Optional Supabase integration
   - Maintain offline capabilities
   - Preserve user data integrity

2. User Authentication Flow
   - Support multiple authentication methods
   - Maintain dev access (admin@admin.com/admin)
   - Preserve user sessions across refreshes
   - Handle role-based access control

3. Module Structure
```javascript
/app
├── assets/
│   ├── css/
│   │   ├── main.css        # Core styles
│   │   ├── auth.css        # Authentication styles
│   │   ├── forum.css       # Forum component styles
│   │   ├── header.css      # Header component styles
│   │   └── profile.css     # Profile component styles
│   └── libs/
│       └── localforage.js  # Local storage library
├── js/
│   ├── services/
│   │   ├── auth.service.mjs    # Authentication service
│   │   ├── storage.service.mjs # Data persistence
│   │   ├── forum.service.mjs   # Forum functionality
│   │   └── supabase.mjs        # Supabase integration
│   └── app.js                  # Main application entry
```

## Development Principles

1. Storage Layer
   - LocalForage as primary storage
   - Maintain data structure compatibility with Supabase
   - Implement sync strategies for online/offline states
   - Preserve user data across sessions

2. Authentication
   - Support both local and remote auth
   - Maintain role-based permissions
   - Preserve session state
   - Support multiple users in local storage

3. UI Components
   - Maintain responsive design
   - Support RTL languages
   - Implement dark/light themes
   - Preserve accessibility

## Feature Implementation Guidelines

### 1. Storage Service
```javascript
class StorageService {
    // Core storage operations
    async get(key)
    async set(key, value)
    async remove(key)
    
    // User management
    async getUserProfile(userId)
    async setUserProfile(userId, data)
    
    // Settings management
    async getSettings(userId)
    async setSettings(userId, settings)
    
    // Sync operations
    async syncWithRemote()  // Future implementation
    async checkSyncStatus()
}
```

### 2. Authentication Flow
```javascript
class AuthService {
    // Core auth operations
    async login(credentials)
    async logout()
    async register(userData)
    
    // Session management
    async checkSession()
    async refreshSession()
    
    // Role management
    async getUserRole(userId)
    async checkPermission(userId, permission)
}
```

### 3. UI State Management
```javascript
class App {
    // View management
    async showView(viewName)
    async hideView(viewName)
    
    // Theme management
    async setTheme(theme)
    
    // Language management
    async setLanguage(lang)
    
    // User settings
    async applyUserSettings(settings)
}
```

## Testing Strategy

1. Local Storage Testing
   - Test data persistence
   - Verify data structure integrity
   - Check offline functionality
   - Validate sync operations

2. Authentication Testing
   - Verify login/logout flow
   - Test session persistence
   - Validate role-based access
   - Check dev access credentials

3. UI Testing
   - Verify responsive design
   - Test language switching
   - Validate theme switching
   - Check accessibility compliance

## Development Workflow

1. Feature Implementation
   - Maintain offline-first approach
   - Implement progressive enhancement
   - Add Supabase integration points
   - Preserve existing functionality

2. Code Organization
   - Use ES modules (.mjs) for services
   - Maintain separation of concerns
   - Document integration points
   - Follow consistent naming conventions

3. Quality Assurance
   - Test offline functionality first
   - Verify data persistence
   - Check cross-browser compatibility
   - Validate accessibility

## Future Considerations

1. Data Sync
   - Implement conflict resolution
   - Add sync status indicators
   - Support partial sync
   - Handle sync failures

2. Authentication
   - Add OAuth providers
   - Implement 2FA
   - Add session recovery
   - Enhanced role management

3. UI Enhancements
   - Add animation system
   - Implement gesture support
   - Add keyboard shortcuts
   - Enhanced accessibility
```

This document provides a comprehensive view of the system architecture and development guidelines. It emphasizes:
- Maintaining existing functionality while adding features
- Preserving offline-first capabilities
- Supporting progressive enhancement
- Maintaining data integrity
- Supporting multiple authentication methods
- Providing clear integration points
- Following consistent patterns

Would you like me to expand on any particular aspect?This document provides a comprehensive view of the system architecture and development guidelines. It emphasizes:
- Maintaining existing functionality while adding features
- Preserving offline-first capabilities
- Supporting progressive enhancement
- Maintaining data integrity
- Supporting multiple authentication methods
- Providing clear integration points
- Following consistent patterns




Notes
Maintain admin@admin.com/admin credentials for development
Use semantic versioning for releases
Document all API changes
Keep backward compatibility
Test export functionality with various data types
Support multiple export formats (CSV, JSON)
Implement proper error handling
Add progress indicators for long operations
Support batch operations
Maintain data integrity
For more detailed implementation examples or specific use cases, please refer to the individual service documentation.




