import http from "k6/http";
import faker from '../../perf-k6/modules/faker.js'; 
import { SharedArray } from "k6/data";
import { check } from "k6";
//importing checks from k6

const data = new SharedArray("user details for registration", function () {
  return JSON.parse(open("../../perf-k6/data/parameterizedData.json")).users;
});

export default function () {
  const url = "https://test-api.k6.io/user/register/";
  const params = { headers: { "Content-Type": "application/json" } };
  const payload = {
    username: faker.internet.userName(),
    first_name: faker.name.firstName(),
    last_name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  let response = http.post(url,JSON.stringify(payload),params)
  check(response, {
    "response code was 201": (res) => response.status == 201,
  });
  /* checks are similar to assertion but does not stop the execution. Stores the result based on condition
     let the script execution continue*/
}
