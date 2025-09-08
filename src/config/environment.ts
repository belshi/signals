// Environment configuration - now using the centralized ConfigurationService
// This file maintains backward compatibility while delegating to the new service
import { configService } from './ConfigurationService';

export const config = configService.config;

// Validate required environment variables - now handled by ConfigurationService
export const validateEnvironment = () => {
  // Configuration validation is now handled automatically by ConfigurationService
  // This function is kept for backward compatibility
  console.log('Environment validation is now handled by ConfigurationService');
};

// Call validation on import - now handled by ConfigurationService
if (typeof window !== 'undefined') {
  validateEnvironment();
}
