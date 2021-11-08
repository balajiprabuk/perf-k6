'use strict';
import http from 'k6/http';
// importing http module that contains functionality for performing HTTP transactions

const BASE_URL = 'https://test-api.k6.io';

//k6 entry point
export default function () {
  const URL = `${BASE_URL}/user/register/`;
  const PAYLOAD = {
    username: 'demo',
    first_name: 'demo',
    last_name: 'demo',
    email: 'demo@example.com',
    password: 'demo',
  };
  const PARAMS = { headers: { 'Content-Type': 'application/json' } };
  let response = http.post(URL, JSON.stringify(PAYLOAD), PARAMS);
  // returns a Response object
  console.log('response code is :', response.status);

  // const req1 = {
  //   method: 'GET',
  //   url: `${BASE_URL}/public/crocodiles/1/`,
  // };
  // const req2 = {
  //   method: 'GET',
  //   url: `${BASE_URL}/public/crocodiles/2/`,
  // };
  // let responses = http.batch([req1, req2]);
  // // responses is of type Object Array
  // console.log('response code is :', responses[0].status);

}

// k6 run src/1_httpRequest.js
