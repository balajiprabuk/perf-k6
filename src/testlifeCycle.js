import http from "k6/http";
import faker from "../modules/faker.js";
import { check, group } from "k6";
import { Trend } from "k6/metrics";

let loginCrocodileTrend = new Trend("http_req_duration_login_crocodile");

const BASE_URL = "https://test-api.k6.io";

export let options = {
  thresholds: {
    http_req_duration_login_crocodile: ["p(95)<400"], // 95% of requests should be below 400ms
  },
};

export function setup() {

  const registeredUserName = "";
  const registeredPassword = "";

  const URL = `${BASE_URL}/auth/token/login/`;
  const PAYLOAD = {
    username: registeredUserName,
    password: registeredPassword,
  };
  let response = http.post(URL, JSON.stringify(PAYLOAD), {
    headers: { "Content-Type": "application/json" },
  });
  const authToken = JSON.parse(response.body).access;
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
    loginCrocodileTrend.add(response.timings.duration);
    check(response, {
      "Created crocodile successfully": () => response.status == 201,
    });
  });
}

export function teardown() {
  //Perform resource cleanups steps
}
