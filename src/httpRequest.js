import http from "k6/http";
// importing http module that contains functionality for performing HTTP transactions


//k6 entry point 
export default function () {
  const url = "https://test-api.k6.io/user/register/";
  const payload = {
    username: "sample1111",
    first_name: "test",
    last_name: "user",
    email: "test11111@tester.com",
    password: "tester",
  };
  const params = { headers: { "Content-Type": "application/json" } };

  //url type type string
  //payload type string / object / ArrayBuffer.objects will be x-www-form-urlencoded
  //params type object
  let response = http.post(url, JSON.stringify(payload), params);
  // returns a Response object 
  console.log(response.status)
}
