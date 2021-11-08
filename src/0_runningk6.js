import { sleep } from 'k6';

//k6 entry point - similar to main() method for java
export default function () {
  sleep(0.5)
}

// k6 run src/0_runningk6.js 
// k6 run src/0_runningk6.js --iterations 4 iterations - how many times to execute the block of code inside default function()
// k6 run src/0_runningk6.js --iterations 4 --vus 3 vus - similated user who performs the block of code.