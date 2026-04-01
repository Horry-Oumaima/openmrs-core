import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {
  const res = http.get('http://api:8080/openmrs/ws/rest/v1/session');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}