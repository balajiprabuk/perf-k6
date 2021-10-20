import http from "k6/http";
import faker from "../modules/faker.js";
import { check, group } from "k6";
import { Trend } from "k6/metrics";
//importing trend metrics from k6

let registerTrendObject = new Trend("http_req_duration_registration");
let loginTrendObject = new Trend("http_req_duration_login");
const BASE_URL = "https://test-api.k6.io";

export let options = {
  thresholds: {
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    http_req_duration: ["p(95)<200"], // 95% of requests should be below 200ms
  },
};

export default function () {
  let username = faker.internet.userName();
  let password = faker.internet.password();
  group("User registration", function () {
    const URL = `${BASE_URL}/user/register/`;
    const PARAMS = { headers: { "Content-Type": "application/json" } };
    const PAYLOAD = {
      username: username,
      password: password,
      first_name: faker.name.firstName(),
      last_name: faker.name.firstName(),
      email: faker.internet.email(),
    };
    let response = http.post(URL, JSON.stringify(PAYLOAD), PARAMS);
    registerTrendObject.add(response.timings.duration);

    check(response, {
      "User registration response code should be 201": (res) =>
        response.status == 201,
    });
  });

  group("Login User", function () {
    const URL = `${BASE_URL}/auth/basic/login/`;
    const PAYLOAD = {
      username: username,
      password: password,
    };
    const PARAMS = { headers: { "Content-Type": "application/json" } };
    let response = http.post(URL, JSON.stringify(PAYLOAD), PARAMS);
    loginTrendObject.add(response.timings.duration);
    check(response, {
      "login code should be 200": (res) => response.status == 200,
    });
  });
}
