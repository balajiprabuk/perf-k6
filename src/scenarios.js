
import http from "k6/http";
import faker from "../modules/faker.js";
import { SharedArray } from "k6/data";
import { group } from "k6";
import { Trend } from "k6/metrics";

let registerTrendObject = new Trend("http_req_duration_registration");
let loginTrendObject = new Trend("http_req_duration_login");

const data = new SharedArray("user details for registration", function () {
  return JSON.parse(open("../../perf-k6/data/parameterizedData.json")).users;
});

export let options = {
  scenarios: {
    user_scenario: {
      // name of the executor to use
      executor: "shared-iterations",
      // executor-specific configuration
      vus: 10,
      iterations: 10,
    },
  },
};

export default function () {
  let username, password;
  group("User registration", function () {
    username = faker.internet.userName();
    password = faker.internet.password();
    const url = "https://test-api.k6.io/user/register/";
    const params = { headers: { "Content-Type": "application/json" } };
    const payload = {
      username: username,
      password: password,
      first_name: faker.name.firstName(),
      last_name: faker.name.firstName(),
      email: faker.internet.email(),
    };
    let response = http.post(url, JSON.stringify(payload), params);
    registerTrendObject.add(response.timings.duration);
  });

  group("Login User", function () {
    const url = "https://test-api.k6.io/auth/basic/login/";
    const payload = {
      username: username,
      password: password,
    };
    const params = { headers: { "Content-Type": "application/json" } };
    let response = http.post(url, JSON.stringify(payload), params);
    loginTrendObject.add(response.timings.duration);
  });
}
