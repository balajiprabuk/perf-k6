import http from "k6/http";
import faker from "../modules/faker.js";
import { check, group } from "k6";

const BASE_URL = "https://test-api.k6.io";

export let options = {
  thresholds: {
    "checks{pattern:Load}": ["rate>0.9"],
    "checks{pattern:Spike}": ["rate>0.9"],
    "http_req_duration{pattern:Spike": ["p(95)<900"],
    "http_req_duration{pattern:Load": ["p(95)<900"],
  },
  //Scenarios allow us to make in depth configurations to how VUs and iterations are scheduled
  scenarios: {
    login_crocodile_shared: {
      executor: "constant-arrival-rate",
      rate: 5,
      duration: "0m10s",
      preAllocatedVUs: 5,
      maxVUs: 10,
      tags: { pattern: "Load" },
    },
    login_crocodile_fixed: {
      executor: "ramping-vus",
      startTime: "11s",
      startVUs: 1,
      stages: [
        { duration: "5s", target: 10 },
        { duration: "5s", target: 0 },
      ],
      tags: { pattern: "Spike" },
    },
  },
};

export default function () {
  const registeredUserName = "catchup";
  const registeredPassword = "catchup";

  const URL = `${BASE_URL}/auth/token/login/`;
  const PAYLOAD = {
    username: registeredUserName,
    password: registeredPassword,
  };
  let response = http.post(URL, JSON.stringify(PAYLOAD), {
    headers: { "Content-Type": "application/json" },
  });
  const authToken = JSON.parse(response.body).access;

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
    check(response, {
      "Created crocodile successfully": () => response.status == 201,
    });
  });
}

//k6 run 9_scenarios.js
