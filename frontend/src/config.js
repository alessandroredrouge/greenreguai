const config = {
    // API Configuration
    API_URL: process.env.NODE_ENV === 'production' 
        ? process.env.REACT_APP_API_URL 
        : 'http://localhost:8000/api/v1',
        
    // Supabase Configuration
    SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY,
    
    // Feature Flags
    ENABLE_LOGGING: process.env.NODE_ENV !== 'production',
    
    // Rate Limiting (matching backend)
    RATE_LIMIT_PER_MINUTE: process.env.NODE_ENV === 'production' ? 60 : 100,
};

export default config; 