import { SecureConfig } from "./config.js";
import { UnifiedApiClient } from "./api-client.js";


try {

    const config = new SecureConfig();
    const apiClient = new UnifiedApiClient(config);
    console.log("apiClient:\n",apiClient);

    // console.log("Testing getWeather:");
    // const weather = await apiClient.getWeather();
    // const weather2 = await apiClient.getWeather();
    // console.log(apiClient.cache);
    // console.log("Weather result:", weather2);
    
    // const programJoke1 = await apiClient.getProgrammingJoke();
    // const programJoke2 = await apiClient.getProgrammingJoke();
    // console.log(apiClient.cache);
    // console.log("Programming Joke result: ", programJoke2)


    const chuckJoke1 = await apiClient.getChuckNorrisJoke();
    const chuckJoke2 = await apiClient.getChuckNorrisJoke();
    console.log(apiClient.cache);
    // console.log(apiClient.getChuckNorrisJoke());

} catch (error){
    console.log("error:\n", error);
}


/*
1) getWeather(city = 'Kahului') → Calls makeRequest('openWeather', '/weather', { q: 'Kahului,US' })

2) makeRequest(service, endpoint, params):

    a) Calls checkRateLimit('openWeather') to verify rate limits (passes, as no requests made yet).
    b) Calls getCacheKey('openWeather', '/weather', { q: 'Kahului,US' }) to generate cache key: "openWeather:/weather:{\"q\":\"Kahului,US\"}".
    c) Calls isValidCache(cacheKey) (returns false since no cached data exists).
    d) Calls buildRequest('openWeather', '/weather', { q: 'Kahului,US' }, {}) to construct the API request URL and headers.
    e) Performs the fetch request to the OpenWeather API.
    f) On success, calls cacheResponse(cacheKey, data) to store the response in cache.
    g) Calls updateRateLimit('openWeather') to record the request timestamp for rate limiting.
*/



