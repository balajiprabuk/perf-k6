'use strict';
import http from 'k6/http';
// importing http module that contains functionality for performing HTTP transactions

const BASE_URL = 'https://test-api.k6.io';

//k6 entry point
export default function () {

  const GET_URL = `${BASE_URL}/public/crocodiles/1/`;
  let get_reponse = http.get(GET_URL)
  console.log('Response Code is: ', get_reponse.status_text, '\n Response Body: ', get_reponse.body);

  my_methods.post_example();
  my_methods.batch_example();

}

// k6 run src/1_httpRequest.js


const my_methods = {
  
  
  post_example() {
    const POST_URL = `${BASE_URL}/user/register/`;
    const PAYLOAD = {
      username: 'demo',
      first_name: 'demo',
      last_name: 'demo',
      email: 'demo@example.com',
      password: 'demo',
    };
    const PARAMS = { headers: { 'Content-Type': 'application/json' } };
    let response = http.post(POST_URL, JSON.stringify(PAYLOAD), PARAMS);
    // returns a Response object
    console.log('Response code is :', response.status_text);
  },

  
  
  batch_example() {
    const req1 = {
      method: 'GET',
      url: `${BASE_URL}/public/crocodiles/1/`,
    };
    const req2 = {
      method: 'GET',
      url: `${BASE_URL}/public/crocodiles/2/`,
    };
    let responses = http.batch([req1, req2]);
    // responses is of type Object Array
    console.log('response code is :', responses[0].status);
  }
}

// import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
// import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";


// // k6 will call handleSummary method at the end of the test run
// export function handleSummary(data) {
//   return {
//     "./results/result.html": htmlReport(data),
//     stdout: textSummary(data, { indent: " ", enableColors: true }) + "\n",
//   };
// }