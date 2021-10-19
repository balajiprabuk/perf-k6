import http from "k6/http";
import faker from '../../perf-k6/modules/faker.js'; 
//importing faker library using browserify. 
//with this we can import npm modules as internal module 

export default function () {
  const url = "https://test-api.k6.io/user/register/";
  const params = { headers: { "Content-Type": "application/json" } };
  
  //Using faker library generating random data at run time for all the iterations.This ensures dynamic data passed
  //at run time for our payload 

  const payload = {
    username: faker.internet.userName(),
    first_name: faker.name.firstName(),
    last_name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };


  let response = http.post(url,JSON.stringify(payload),params)
  console.log("response code is :", response.status)
  //All repsonse are 201 because of unique data passed as payload
}

