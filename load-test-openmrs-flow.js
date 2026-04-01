import http from 'k6/http';
import { check, sleep } from 'k6';
import encoding from 'k6/encoding';

const username = 'admin';
const password = 'Admin123';
const credentials = encoding.b64encode(`${username}:${password}`);

const params = {
  headers: {
    Authorization: `Basic ${credentials}`,
    Accept: 'application/json',
  },
};

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
  const sessionRes = http.get('http://api:8080/openmrs/ws/rest/v1/session', params);
  check(sessionRes, {
    'session ok': (r) => r.status === 200,
  });

  const patientSearchRes = http.get('http://api:8080/openmrs/ws/rest/v1/patient?q=test', params);
  check(patientSearchRes, {
    'patient search ok': (r) => r.status === 200,
  });

  sleep(1);
}