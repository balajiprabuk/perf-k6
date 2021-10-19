import http from "k6/http";
import faker from "cdnjs.com/libraries/Faker";

export default function () {
  const url = "https://test-api.k6.io/user/register/";
  const params = { headers: { "Content-Type": "application/json" } };
  const payload = {
    username: faker.internet.userName,
    first_name: faker.name.firstName,
    last_name: faker.name.firstName,
    email: faker.internet.email,
    password: faker.internet.password,
  };
  http.post(url,JSON.stringify(payload),params)
}

// to  work on this file
