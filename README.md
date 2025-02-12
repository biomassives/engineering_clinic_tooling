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
