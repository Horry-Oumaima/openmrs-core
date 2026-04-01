import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '20s', target: 5 },
    { duration: '20s', target: 10 },
    { duration: '30s', target: 20 },
    { duration: '20s', target: 30 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<200'],
  },
};

export default function () {
  const res = http.get('http://otel-app:3000/');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}