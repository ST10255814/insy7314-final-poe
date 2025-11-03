import axios from "axios"

const api = axios.create({
    baseURL: 'https://127.0.0.1:5000',
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
})

// Log all requests and responses and errors
api.interceptors.request.use(request => {
    console.log('Starting Request', request)
    return request
})

api.interceptors.response.use(response => {
    console.log('Response:', response)
    return response
}, error => {
    console.log('Error Response:', error.response)
    //Handle 401 errors globally
    if (error.response && error.response.status === 401) {
        // Optionally, you can redirect to login page or perform other actions
        console.log('Unauthorized! Redirecting to login...')
        window.location.href = '/login';
    }
    return Promise.reject(error)
})

export default api;