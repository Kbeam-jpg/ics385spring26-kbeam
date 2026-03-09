/* INFO
NAME: Kendall Beam
ASSIGNMENT: Assignment 8b - Integrated Campus Dashboard
GOAL: configuration class for apis
FILENAME: config.js
DATE: 3/9/2026
*/

// config.js - Secure configuration management
/**
 * this.config = this.loadConfiguration();
 */
class SecureConfig {

    constructor() {
        this.config = this.loadConfiguration();
        this.validateConfiguration();
    }

    // In a real application, these would come from environment variables
    // For demo purposes, we'll use a secure client-side approach
    loadConfiguration() {
        return {
            apis: {
                openWeather: {
                    key: this.getSecureApiKey('openweather'),
                    baseUrl: 'https://api.openweathermap.org/data/2.5',
                    endpoints: {
                        current: '/weather',
                        forecast: '/forecast'
                    },
                    rateLimit: {
                        requests: 60,
                        period: 60000 // 1 minute
                    },
                    timeout: 5000
                },
                rapidApi: {
                    key: this.getSecureApiKey('rapidapi'),
                    host: 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com',
                    baseUrl: 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com',
                    endpoints: {
                        random: '/jokes/random',
                        categories: '/jokes/categories'
                    },
                    rateLimit: {
                        requests: 100,
                        period: 60000
                    },
                    timeout: 3000
                },
                jokeApi: {
                    baseUrl: 'https://sv443.net/jokeapi/v2',
                    endpoints: {
                        joke: '/joke/Programming',
                        categories: '/categories'
                    },
                    rateLimit: {
                        requests: 120,
                        period: 60000
                    },
                    timeout: 3000
                }
            },
            app: {
                name: 'UH Maui Campus Dashboard',
                version: '1.0.0',
                defaultCity: 'Kahului',
                refreshInterval: 10 * 60 * 1000, // 10 minutes
                cacheExpiry: 10 * 60 * 1000, // 10 minutes
                maxRetries: 3,
                retryDelay: 1000
            },
            ui: {
                animationDuration: 300,
                toastDuration: 5000,
                modalTimeout: 10000,
                loadingDelay: 500
            }
        };
    }

    // In production, this would retrieve from secure storage
    // For development, use localStorage with warning
    getSecureApiKey(service) {
        const key = localStorage.getItem(service + '_api_key');

        if (!key) {
            throw new Error('API key for ' + service + ' not configured. Please set up your API keys.');
        }
        return key;
    }

    validateConfiguration() {
        const required = ['openweather_api_key', 'rapidapi_api_key'];
        const missing = required.filter(key => !localStorage.getItem(key));

        if (missing.length > 0) {
            throw new Error('Missing required API keys: ' + missing.join(', ') +
            '. Please configure your API keys in the settings.');
        }
    }

    getApiConfig(service) {
        if (!this.config.apis[service]) {
            throw new Error('Unknown API service: ' + service);
        }

        return this.config.apis[service];
    }
    
    getAppConfig() {
        return this.config.app;
    }

    getUiConfig() {
        return this.config.ui;
    }
}

// Initialize configuration
const appConfig = new SecureConfig();