import http from "k6/http";
// importing http module that contains functionality for performing HTTP transactions

const BASE_URL = "https://test-api.k6.io";

//k6 entry point
export default function () {
  const URL = `${BASE_URL}/user/register/`;
  const PAYLOAD = {
    username: "demo",
    first_name: "demo",
    last_name: "demo",
    email: "demo@example.com",
    password: "demo",
  };
  const PARAMS = { headers: { "Content-Type": "application/json" } };

  //url type type string
  //payload type string / object / ArrayBuffer.objects will be x-www-form-urlencoded
  //params type object
  let response = http.post(URL, JSON.stringify(PAYLOAD), PARAMS);
  // returns a Response object
  console.log("response code is :", response.status);
}

// k6 run httpRequest.js || k6 run httpRequest.js --iterations=6 --vus=2
