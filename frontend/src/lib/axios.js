import axios from "axios"

// Helper function to get CSRF token from cookies
const getCSRFToken = () => {
    const name = 'csrf-token='
    const decodedCookie = decodeURIComponent(document.cookie)
    const cookieArray = decodedCookie.split(';')
    
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim()
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length)
        }
    }
    return null
}

// Function to ensure CSRF token is available
const ensureCSRFToken = async () => {
    let token = getCSRFToken()
    if (!token) {
        console.log('No CSRF token found, fetching...')
        try {
            // Use our configured api instance to ensure proper cookie handling
            const response = await api.get('/api/csrf-token')
            console.log('CSRF token fetched:', response.data.csrfToken)
            // Wait a bit for cookie to be set
            await new Promise(resolve => setTimeout(resolve, 100))
            token = getCSRFToken()
            console.log('Token after fetch:', token)
        } catch (error) {
            console.error('Failed to fetch CSRF token:', error)
        }
    }
    return token
}

const api = axios.create({
    baseURL: 'https://localhost:5000',
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
})

// Request interceptor to add CSRF token for state-changing requests
api.interceptors.request.use(async (request) => {
    console.log('Starting Request', request)
    
    // Skip CSRF token for the csrf-token endpoint itself to avoid circular dependency
    if (request.url && request.url.includes('/api/csrf-token')) {
        return request
    }
    
    // Add CSRF token for non-safe methods (POST, PUT, DELETE, PATCH)
    if (['post', 'put', 'delete', 'patch'].includes(request.method.toLowerCase())) {
        const csrfToken = await ensureCSRFToken()
        if (csrfToken) {
            request.headers['X-CSRF-Token'] = csrfToken
            console.log('CSRF Token added to request:', csrfToken.substring(0, 8) + '...')
        } else {
            console.warn('CSRF token not found in cookies')
            console.log('Available cookies:', document.cookie)
        }
    }
    
    return request
})

api.interceptors.response.use(response => {
    console.log('Response:', response)
    return response
}, error => {
    console.log('Error Response:', error.response)
    
    // Handle 401 errors globally
    if (error.response && error.response.status === 401) {
        // Clear all tokens and redirect to login
        sessionStorage.clear()
        localStorage.clear()
        console.log('Unauthorized! Redirecting to login...')
        window.location.href = '/login'
    }
    
    // Handle CSRF token errors - clear tokens and retry could be implemented here
    if (error.response && error.response.status === 403 && 
        error.response.data && error.response.data.error && 
        error.response.data.error.includes('CSRF')) {
        console.log('CSRF error detected - may need fresh token on next request')
    }
    
    return Promise.reject(error)
})

export default api;