import http from "k6/http";
import faker from "../../modules/faker.js";
import { check } from "k6";
import { Trend } from 'k6/metrics';

const BASE_URL = "https://test-api.k6.io";

/*Counters - sum values.
Trends - calculate statistics for multiple values (like mean or mode).
Rates - track how frequently a non-zero value occurs.
Gauges - track the smallest, largest, and latest values */

const myTrend = new Trend('response_time');

export const options = {
  vus: 10,
  iterations: 10,
  thresholds: {
    checks: ["rate>0.99"],     // the rate of successful checks should be higher than 99%
    http_req_duration: ["p(95)<700"], // 95% of requests should be below 700ms
  }
};
export default function () {
  const URL = `${BASE_URL}/user/register/`;
  const PARAMS = { headers: { "Content-Type": "application/json" } };
  const PAYLOAD = {
    username: faker.internet.userName(),
    first_name: faker.name.firstName(),
    last_name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  let response = http.post(URL, JSON.stringify(PAYLOAD), PARAMS);
  
   myTrend.add(response.timings.duration);
 
  check(response, {
    "response code was 201": (res) => response.status == 201,
  });
}

//  k6 run --out json=results.json metrics.js
 // k6 run --out influxdb=http://localhost:8087/tech_radar_db metrics.js
