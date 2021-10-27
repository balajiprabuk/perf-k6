import http from 'k6/http';
import faker from '../modules/faker.js'; 
//importing faker library using browserify. 
//with this we can import npm modules as internal module 

const BASE_URL = 'https://test-api.k6.io';

export default function () {
  const URL = `${BASE_URL}/user/register/`;
  const PARAMS = { headers: { 'Content-Type': 'application/json' } };
  
  //Using faker library generating random data at run time for all the iterations.This ensures dynamic data passed
  //at run time for our payload 

  const PAYLOAD = {
    username: faker.internet.userName(),
    first_name: faker.name.firstName(),
    last_name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };


  let response = http.post(URL,JSON.stringify(PAYLOAD),PARAMS)
  console.log('response code is :', response.status)
  //All repsonse are 201 because of unique data passed in payload
}


//  npm install browserify faker
// ./node_modules/.bin/browserify ./node_modules/faker/ -s faker > faker.js 
