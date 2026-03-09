/* INFO
NAME: Kendall Beam
ASSIGNMENT: Assignment 8b - Integrated Campus Dashboard
GOAL: api client class for making/building requests, caching, and handling errors
FILENAME: api-client.js
DATE: 3/9/2026
*/

// curl --request GET \
// 	--url https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random \
// 	--header 'Content-Type: application/json' \
// 	--header 'accept: application/json' \
// 	--header 'x-rapidapi-host: matchilling-chuck-norris-jokes-v1.p.rapidapi.com' \
// 	--header 'x-rapidapi-key: 08bf3d339fmsh71800bbab2aa49ap1371c0jsn40dc35171d0f'


/**  Unified API client with error handling and caching
 * @constructor {SecureConfig} object
 * - this.config = config;
 * - this.cache = new Map();
 * - this.requestTimestamps = new Map();
 * - this.rateLimiters = new Map();
 */
export class UnifiedApiClient {

    constructor(config) {
        this.config = config.config;
        this.cache = new Map();
        this.requestTimestamps = new Map();
        this.rateLimiters = new Map();
        this.initializeRateLimiters();
    }

    initializeRateLimiters() {
        Object.keys(this.config.apis).forEach(service => {
            this.rateLimiters.set(service, {
                requests: [],
                limit: this.config.apis[service].rateLimit.requests,
                period: this.config.apis[service].rateLimit.period
            });
        });
    }

    async makeRequest(service, endpoint, params = {}, options = {}) {
        console.log('DEBUG: makeRequest called for', service, endpoint, 'with params', params);
        try {
            // Check rate limiting
            console.log('DEBUG: Checking rate limit for', service);
            if (!this.checkRateLimit(service)) {
                throw new Error('Rate limit exceeded for ' + service + '. Please wait.');
            }
            // Check cache
            console.log('DEBUG: Getting cache key');
            const cacheKey = this.getCacheKey(service, endpoint, params);
            console.log('DEBUG: Cache key:', cacheKey);

            if (this.isValidCache(cacheKey)) {
                console.log('DEBUG: Returning cached data for', service, endpoint);
                return this.cache.get(cacheKey).data;
            }

            // Build request
            console.log('DEBUG: Building request');
            const requestConfig = this.buildRequest(service, endpoint, params, options);
            console.log('DEBUG: Request config:', requestConfig);
            // Make request with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(),
            this.config.apis[service].timeout);

            console.log('DEBUG: Making fetch request to', requestConfig.url);
            const response = await fetch(requestConfig.url, {
                ...requestConfig.options,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(service + ' API error: ' + response.status + ' - ' +
                response.statusText);
            }

            const data = await response.json();
            console.log('DEBUG: Received data:');
            // Cache successful response
            console.log('DEBUG: Caching response');
            this.cacheResponse(cacheKey, data);
            // Update rate limiting
            console.log('DEBUG: Updating rate limit');
            this.updateRateLimit(service);

            return data;

        } catch (error) {
            console.error('DEBUG: API request failed:', error);
            return this.handleApiError(service, endpoint, error);
        }
    }

    buildRequest(service, endpoint, params, options) {
        console.log('DEBUG: buildRequest called for', service, endpoint, params);
        const apiConfig = this.config.apis[service];
        let url = apiConfig.baseUrl + endpoint;
        const headers = { 'Content-Type': 'application/json', ...options.headers };

        switch (service) {
            case 'openWeather':
                const weatherParams = new URLSearchParams({
                    ...params,
                    units: 'imperial',
                    appid: apiConfig.key
                });

                url += '?' + weatherParams.toString();

                break;
            case 'rapidApi':
                headers['X-RapidAPI-Key'] = apiConfig.key;
                headers['X-RapidAPI-Host'] = apiConfig.host;

                break;
            case 'jokeApi':
                if (Object.keys(params).length > 0) {
                    url += '?' + new URLSearchParams(params).toString();
                }
                break;
            default:
                // throw an error?
        }

        return {
            url: url,
            options: {
                method: 'GET',
                headers: headers
            }
        };
    }

    checkRateLimit(service) {
        console.log('DEBUG: checkRateLimit called for', service);
        const limiter = this.rateLimiters.get(service);
        const now = Date.now();
        // Remove old requests outside the time window
        limiter.requests = limiter.requests.filter(time => now - time < limiter.period);

        return limiter.requests.length < limiter.limit;
    }

    updateRateLimit(service) {
        console.log('DEBUG: updateRateLimit called for', service);
        this.rateLimiters.get(service).requests.push(Date.now());
    }

    getCacheKey(service, endpoint, params) {
        console.log('DEBUG: getCacheKey called for', service, endpoint, params);
        return service + ':' + endpoint + ':' + JSON.stringify(params);
    }

    isValidCache(cacheKey) {
        console.log('DEBUG: isValidCache called for', cacheKey);
        if (!this.cache.has(cacheKey)) return false;
        const cached = this.cache.get(cacheKey);
        return Date.now() - cached.timestamp < this.config.app.cacheExpiry;
    }

    cacheResponse(cacheKey, data) {
        console.log('DEBUG: cacheResponse called for', cacheKey);
        this.cache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
        });
    }

    handleApiError(service, endpoint, error) {

        console.error('API Error Details:', {
            service: service,
            endpoint: endpoint,
            error: error.message,
            timestamp: new Date().toISOString()
        });

        // Return fallback data based on service
        switch (service) {
            case 'openWeather':
                return {
                    name: 'Kahului',
                    main: { temp: 78, humidity: 65 },
                    weather: [{ description: 'partly cloudy', icon: '02d' }],
                    wind: { speed: 12 },
                    error: true,
                    message: 'Weather data temporarily unavailable'
                };
            case 'rapidApi':
                return {
                value: 'Chuck Norris doesn\'t need the internet. The internet needs Chuck Norris.',
                error: true,
                message: 'Chuck Norris jokes temporarily unavailable'
                };
            case 'jokeApi':
                return {
                joke: 'Why do programmers prefer dark mode? Because light attracts bugs!',
                error: true,
                message: 'Programming jokes temporarily unavailable'
                };
            default:
                throw error;
        }
    }

    // Convenience methods for specific APIs
    /**
     * 
     * @param {*} city 
     * @returns 
     */
    async getWeather(city = 'Kahului') {
        return this.makeRequest('openWeather', '/weather', { q: city + ',US' });
    }

    async getChuckNorrisJoke() {
        return this.makeRequest('rapidApi', '/jokes/random');
    }

    async getProgrammingJoke() {
        return this.makeRequest('jokeApi', '/joke/Programming', { type: 'single' });
    }

    /**
     * 
     * @returns {Object} {chuck: promiseresult
                programming: promiseresult
            }
     */
    async getAllJokes() {
        try {
            const [chuck, programming] = await Promise.allSettled([
                this.getChuckNorrisJoke(),
                this.getProgrammingJoke()
            ]);

            return {
                chuck: chuck.status === 'fulfilled' ? chuck.value : null,
                programming: programming.status === 'fulfilled' ? programming.value : null
            };

        } catch (error) {
            console.error('Failed to fetch jokes:', error);
            return { chuck: null, programming: null };
        }
    }
}


