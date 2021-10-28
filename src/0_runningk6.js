import { sleep } from 'k6';

//k6 entry point
export default function () {
  sleep(0.5)
}

// k6 run script.js
// docker run -i loadimpact/k6 run - <src/first-sample.js
// k6 run src/first-sample.js --vus 3 --iterations 4