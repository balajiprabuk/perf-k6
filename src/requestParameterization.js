import http from "k6/http";
import { SharedArray } from "k6/data";
//importing sharedArray from k6

const data = new SharedArray("user details for registration", function() { return JSON.parse(open('../../perf-k6/data/parameterizedData.json')).users; });
// array-like object that shares the underlying memory between VUs

export default function () {
  const url = "https://test-api.k6.io/user/register/";
  const params = { headers: { "Content-Type": "application/json" } };
  const payload = JSON.stringify(data[__ITER])
  //__ITER is predefined k6 environment variable which stores the iteration index 

  let response = http.post(url, payload, params);
  console.log(response.status)
}


