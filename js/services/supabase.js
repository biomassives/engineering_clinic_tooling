
export const SUPABASE_URL = 'https://vlvbodwrtblttvwnxkjx.supabase.co';

export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsdmJvZHdydGJsdHR2d254a2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY3NDk2NzIsImV4cCI6MjAwMjMyNTY3Mn0.TRT1HeX85vP1zDxnU7qBz5GqNPgYZUj-BOdek4qmtEg';

const supabaseClient = {
    auth: {
      signIn: function(credentials) {
        return this._handleAuth('signIn', credentials);
      },
      signUp: function(credentials) {
        return this._handleAuth('signUp', credentials);
      },
      signOut: function() {
        return localforage.removeItem('currentSession');
      },
      getSession: function() {
        return localforage.getItem('currentSession');
      },
      _handleAuth: async function(type, credentials) {
        try {
          const userKey = `auth_${credentials.email}`;
          if (type === 'signUp') {
            await localforage.setItem(userKey, {
              email: credentials.email,
              password: btoa(credentials.password),
              created_at: new Date().toISOString()
            });
          }
          const user = await localforage.getItem(userKey);
          if (!user || user.password !== btoa(credentials.password)) {
            throw new Error('Invalid credentials');
          }
          return { user, session: { user_id: credentials.email } };
        } catch (error) {
          console.error(`Auth ${type} failed:`, error);
          throw error;
        }
      }
    }
  };
  
  export { supabaseClient as supabase };
