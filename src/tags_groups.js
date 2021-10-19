
import http from "k6/http";
import faker from "../modules/faker.js";
import { SharedArray } from "k6/data";
import { check, group } from "k6";
//importing group from k6

const data = new SharedArray("user details for registration", function () {
  return JSON.parse(open("../../perf-k6/data/parameterizedData.json")).users;
});

export let options = {
  thresholds: {
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    http_req_duration: ["p(95)<200"], // 95% of requests should be below 200ms
  },
};

export default function () {
  let username, password 
  group("User registration", function () {
    username = faker.internet.userName()
    password = faker.internet.password()
    const url = "https://test-api.k6.io/user/register/";
    const params = { headers: { "Content-Type": "application/json" } };
    const payload = {
      username: username,
      password: password,
      first_name: faker.name.firstName(),
      last_name: faker.name.firstName(),
      email: faker.internet.email()
    };
    let response = http.post(url, JSON.stringify(payload), params);
    check(response, {
      "User registration response code should be 201": (res) =>
        response.status == 201,
    });
  });

  group("Login User", function () {
    const url = "https://test-api.k6.io/auth/basic/login/";
    const payload = {
      username: username,
      password: password,
    };
    const params = { headers: { "Content-Type": "application/json" } };
    let response = http.post(url, JSON.stringify(payload), params);
    check(response, {
      "login code should be 200": (res) => response.status == 200,
    });

  });
}
