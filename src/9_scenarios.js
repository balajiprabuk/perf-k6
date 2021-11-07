import http from "k6/http";
import faker from "../modules/faker.js";
import { check, group } from "k6";

const BASE_URL = "https://test-api.k6.io";

export let options = {
  thresholds: {
    "checks{Tag:fixed_iterations}": ["rate>0.9"],
    "checks{Tag:shared_iterations}": ["rate>0.9"],
    "http_req_duration{test_type:shared}": ["p(95)<900"],
    "http_req_duration{test_type:fixed}": ["p(99)<900"],
  },
  //Scenarios allow us to make in depth configurations to how VUs and iterations are scheduled
  scenarios: {
    login_crocodile_shared: {
      executor: "shared-iterations",
      //Deliver the expected load pattern
      vus: 2,
      iterations: 6,
      maxDuration: "10s",
      env: {
        loadType: "shared_iterations",
      },
    },
    login_crocodile_fixed: {
      executor: "per-vu-iterations",
      startTime: "11s",
      vus: 2,
      iterations: 4,
      env: {
        loadType: "fixed_iterations",
      },
    },
  },
};

export default function () {
  const registeredUserName = "vdemo";
  const registeredPassword = "vdemo";

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
    check(
      response,
      {
        "Created crocodile successfully": () => response.status == 201,
      },
      { tag: __ENV.loadType }
    );
  });
}

//k6 run scenarios.js
