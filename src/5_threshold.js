import http from "k6/http";
import faker from "../modules/faker.js";
import { check } from "k6";

const BASE_URL = "https://test-api.k6.io";

//Thresholds define the pass fail criteria for the tests
//Ex: Response time for 95% of requests should be below 200ms.
//Ex: Failure rate should be less than 1%
//Ex: Server prorcessing time for 95% of requests should be below 200ms



export const options = {
  //Options allow you to configure how k6 should behave during test execution.

  vus: 1,
  iterations: 5,
  thresholds: {
    // the rate of successful checks should be higher than 99%
    checks: ["rate>0.99"],
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    http_req_duration: ["p(95)<700"], // 95% of requests should be below 700ms
  },
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
  check(response, {
    "response code was 201": (res) => response.status == 200,
  });
}
 // k6 run 5_threshold.js
