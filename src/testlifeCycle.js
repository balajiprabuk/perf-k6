import http from "k6/http";
import faker from "../modules/faker.js";
import { check, group } from "k6";
import { Trend } from "k6/metrics";

const BASE_URL = "https://test-api.k6.io";
let loginCrocodileTrend = new Trend("http_req_duration_login_crocodile");
export let options = {};

export function setup() {
  let username = faker.internet.userName();
  let password = faker.internet.password();
  let authToken;
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
    check(response, {
      "User registration response code should be 201": (res) =>
        response.status == 201,
    });
  });

  group("Login User", function () {
    const URL = `${BASE_URL}/auth/token/login/`;
    const PAYLOAD = {
      username: username,
      password: password,
    };
    let response = http.post(URL, JSON.stringify(PAYLOAD), {
      headers: { "Content-Type": "application/json" },
    });
    authToken = JSON.parse(response.body).access;
    check(authToken, { "logged in successfully": () => authToken !== "" });
  });
  return authToken;
}

export default function (authToken) {
  group("Create a new crocodile", function () {
    const URL = `${BASE_URL}/my/crocodiles/`;
    const PAYLOAD = {
      name: faker.name.findName(),
      sex: "M",
      date_of_birth: "2001-01-01",
    };
    const PARAMS = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    let response = http.post(URL, PAYLOAD, PARAMS);
    loginCrocodileTrend.add(response.timings.duration)
    check(response, { "Created crocodile successfully": () => response.status == 201 });
  });
}

export function teardown(authToken) {
  group("Perform resource cleanups steps", function () {});
}
