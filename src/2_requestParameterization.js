import http from 'k6/http';
import { SharedArray } from 'k6/data';
//importing sharedArray from k6

const PAYLOAD_DATA = new SharedArray('user details for registration', function() { return JSON.parse(open('../../perf-k6/data/parameterizedData.json')).users; });
// array-like object that shares the underlying memory between VUs

const BASE_URL = 'https://test-api.k6.io';

export default function () {
  const URL = `${BASE_URL}/user/register/`;
  const PARAMS = { headers: { 'Content-Type': 'application/json' } };
  const PAYLOAD = JSON.stringify(PAYLOAD_DATA[__ITER])
  //__ITER is predefined k6 environment variable which stores the iteration index 

  let response = http.post(URL, PAYLOAD, PARAMS);
  console.log('response code is :', response.status);
}


