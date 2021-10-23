import http from 'k6/http';
import faker from '../modules/faker.js';
import { check, group } from 'k6';
import { Trend } from 'k6/metrics';

const BASE_URL = 'https://test-api.k6.io';
let loginCrocodileTrend = new Trend('http_req_duration_login_crocodile');

export let options = {
  scenarios: {
    login_crocodile_shared: {
      executor: 'shared-iterations',
      vus: 2,
      iterations: 10,
      maxDuration: '10s',
    },
    login_crocodile_ramp: {
      executor: 'ramping-vus',
      startVUs: 0,
      startTime: '11s',
      stages: [
        { duration: '5s', target: 10 },
        { duration: '5s', target: 0 },
      ],
    },
  },
};
export function setup() {
  const registeredUserName = 'vod';
  const registeredPassword = 'vod';

  const URL = `${BASE_URL}/auth/token/login/`;
  const PAYLOAD = {
    username: registeredUserName,
    password: registeredPassword,
  };
  let response = http.post(URL, JSON.stringify(PAYLOAD), {
    headers: { 'Content-Type': 'application/json' },
  });
  const authToken = JSON.parse(response.body).access;
  return authToken;
}
export default function (authToken) {
  group('Create a new crocodile', function () {
    const URL = `${BASE_URL}/my/crocodiles/`;
    const PAYLOAD = {
      name: faker.name.findName(),
      sex: 'M',
      date_of_birth: '2001-01-01',
    };
    const PARAMS = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    let response = http.post(URL, PAYLOAD, PARAMS);
    loginCrocodileTrend.add(response.timings.duration);
    check(response, {
      'Created crocodile successfully': () => response.status == 201,
    });
  });
}

export function teardown(authToken) {
  //Perform resource cleanups steps
}
