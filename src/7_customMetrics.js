import http from "k6/http";
import faker from "../modules/faker.js";
import { check, group } from "k6";
import { Trend } from "k6/metrics";
//importing trend metrics from k6

//counter - Iterative metrics which sums the values
//Gauge -Stores only the  last value added to it
//Rate - Stores the percentage value added to it
//Trend - Stores statistics like min,max,average and percentiles value added it to

let registerTrendObject = new Trend("");
let loginTrendObject = new Trend("custom_login");
//creating custom metrics object

const BASE_URL = "https://test-api.k6.io";

export let options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    custom_registration: [" p(95)<200"],
    custom_login: ["p(95)<200"],
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

    registerTrendObject.add(
      response.timings.sending + response.timings.receiving
    );

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

    loginTrendObject.add(response.timings.sending + response.timings.receiving);

    check(response, {
      "login code should be 200": (res) => response.status == 200,
    });
  });
}
//k6 run 7_customMetrics.js
