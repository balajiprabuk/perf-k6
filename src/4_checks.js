import http from 'k6/http';
import faker from '../modules/faker.js'; 
import { check } from 'k6';
//importing checks from k6

const BASE_URL = "https://test-api.k6.io";

export default function () {
  const URL = `${BASE_URL}/user/register/`;
  const PARAMS = { headers: { 'Content-Type': 'application/json' } };
  const PAYLOAD = {
    username: faker.internet.userName(),
    first_name: faker.name.firstName(),
    last_name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  let response = http.post(URL,JSON.stringify(PAYLOAD),PARAMS)
  check(response, {
    'response code was 201': (res) => response.status == 201,
  });
  /* checks are similar to assertion but does not stop the execution. Stores the result based on condition
     let the script execution continue*/
}
