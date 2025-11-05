// Performance Testing with k6

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
export let errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '1m', target: 10 }, // Ramp up to 10 users
    { duration: '2m', target: 20 }, // Stay at 20 users
    { duration: '1m', target: 30 }, // Ramp up to 30 users
    { duration: '2m', target: 30 }, // Stay at 30 users
    { duration: '1m', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    errors: ['rate<0.1'], // Error rate must be lower than 10%
  },
};

// Base URL for the application
const BASE_URL = 'http://localhost:3000';
const API_BASE_URL = 'https://localhost:5000';

export default function () {
  group('Frontend Load Test', function () {
    // Test homepage
    let homeResponse = http.get(BASE_URL);
    check(homeResponse, {
      'Homepage status is 200': (r) => r.status === 200,
      'Homepage loads in reasonable time': (r) => r.timings.duration < 1000,
    }) || errorRate.add(1);

    sleep(1);

    // Test login page
    let loginResponse = http.get(`${BASE_URL}/login`);
    check(loginResponse, {
      'Login page status is 200': (r) => r.status === 200,
    }) || errorRate.add(1);

    sleep(1);
  });

  group('API Load Test', function () {
    // Test CSRF token endpoint
    let csrfResponse = http.get(`${API_BASE_URL}/api/csrf-token`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    check(csrfResponse, {
      'CSRF endpoint status is 200': (r) => r.status === 200,
      'CSRF response time < 300ms': (r) => r.timings.duration < 300,
    }) || errorRate.add(1);

    sleep(1);

    // Test API health check
    let healthResponse = http.get(`${API_BASE_URL}/`);
    check(healthResponse, {
      'Health check status is 200': (r) => r.status === 200,
      'Health check response time < 200ms': (r) => r.timings.duration < 200,
    }) || errorRate.add(1);

    sleep(2);
  });
}

export function handleSummary(data) {
  return {
    'performance-results.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options) {
  return `
Performance Test Summary:
========================
Total Requests: ${data.metrics.http_reqs.count}
Failed Requests: ${data.metrics.http_req_failed.count}
Request Rate: ${data.metrics.http_reqs.rate}/s
Average Response Time: ${data.metrics.http_req_duration.avg}ms
95th Percentile: ${data.metrics.http_req_duration['p(95)']}ms
Error Rate: ${(data.metrics.http_req_failed.rate * 100).toFixed(2)}%
  `;
}