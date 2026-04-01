import http from 'k6/http';
import { check, sleep } from 'k6';
import encoding from 'k6/encoding';

const username = 'admin';
const password = 'Admin123';
const credentials = encoding.b64encode(`${username}:${password}`);

export const options = {
  stages: [
    { duration: '20s', target: 5 },
    { duration: '20s', target: 10 },
    { duration: '30s', target: 20 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<3000'],
  },
};

export default function () {
  const params = {
    headers: {
      Authorization: `Basic ${credentials}`,
      Accept: 'application/json',
    },
  };

  const res = http.get('http://api:8080/openmrs/ws/rest/v1/session', params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response contains authenticated info': (r) => r.body && r.body.includes('authenticated'),
  });

  sleep(1);
}