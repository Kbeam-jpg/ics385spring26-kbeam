/* INFO
NAME: Kendall Beam
ASSIGNMENT: Assignment 8b - Integrated Campus Dashboard
GOAL: configuration class for apis
FILENAME: config.js
DATE: 3/9/2026
*/


import 'dotenv/config';
/** Secure configuration management object
 * 
 * this.config = this.loadConfiguration();
 */
export class SecureConfig {

    constructor() {
        this.config = this.loadConfiguration();
        this.validateConfiguration();
    }

   
    loadConfiguration() {
        return {
            apis: {
                openWeather: {
                    key: this.getSecureApiKey('openWeather'),
                    baseUrl: 'https://api.openweathermap.org/data/2.5',
                    endpoints: {
                        current: '/weather',
                        geolocation: '/geo'
                    },
                    rateLimit: {
                        requests: 60,
                        period: 60000 // 1 minute
                    },
                    timeout: 5000
                },
                rapidApi: {
                    key: this.getSecureApiKey('rapidApi'),
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

   
    getSecureApiKey(service) {

        var key;
        try {
            switch (service) {
                case 'openWeather':
                    key = process.env.OPENWEATHER_API_KEY;
                    break;
                case 'rapidApi':
                    key = process.env.RAPIDAPI_KEY;
                    break;
            }
            return key;

        } catch {
            throw new Error('API key for ' + service + ' not configured. Please set up your API keys.\n (see .env.example for expected structure)');
        }
    }

    validateConfiguration() {
        const required = ['OPENWEATHER_API_KEY', 'RAPIDAPI_KEY'];
        const missing = required.filter(key => !process.env[key]);

        if (missing.length > 0) {
            throw new Error('Missing required API keys: ' + missing.join(', ') +
            '. Please configure your API keys in a .env file');
        }

        //###########
        console.log(missing);
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

