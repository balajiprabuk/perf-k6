import http from "k6/http";
import faker from "../modules/faker.js";
import { check, group } from "k6";

export let options = {};

export function setup() {
  let username, password, authToken;
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
    check(response, {
      "User registration response code should be 201": (res) =>
        response.status == 201,
    });
  });

  group("Login User", function () {
    const url = "https://test-api.k6.io/auth/token/login/";
    const payload = {
      username: username,
      password: password,
    };
    let response = http.post(url, JSON.stringify(payload), {
      headers: { "Content-Type": "application/json" },
    });
    authToken = JSON.parse(response.body).access;
    check(authToken, { "logged in successfully": () => authToken !== "" });
  });
  return authToken;
}

export default function (authToken) {
  group("Create a new crocodile", function () {
    const url = "https://test-api.k6.io/my/crocodiles/";
    const payload = {
      name: faker.name.findName(),
      sex: "M",
      date_of_birth: "2001-01-01",
    };
    const params = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    const res = http.post(url, payload, params);
    check(res, { "Created crocodile successfully": () => res.status == 201 });
  });
}

export function teardown(data) {
  group("Perform resource cleanups steps", function () {});
}
