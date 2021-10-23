import http from 'k6/http';
import faker from '../modules/faker.js'; 
import { check } from 'k6';

const BASE_URL = 'https://test-api.k6.io';

export const options = {
  thresholds: {
    // the rate of successful checks should be higher than 90%
    checks: ['rate>0.9'],
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 200ms
  },
};
export default function () {
  const URL = `${BASE_URL}/user/register/`;
  const PARAMS = { headers: { 'Content-Type': 'application/json' } };
  const PAYLOAD = {
    username: faker.internet.userName(),
    first_name: faker.name.firstName(),
    last_name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  let response = http.post(URL, JSON.stringify(PAYLOAD), PARAMS);
  check(response, {
    'response code was 201': (res) => response.status == 201,
  });
}
