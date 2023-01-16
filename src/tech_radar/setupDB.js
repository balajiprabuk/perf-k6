const Influx = require('influx');
const influx = new Influx.InfluxDB({
    host: 'localhost',
    port: 8087,
    username: 'username',
    password: 'password'
})
const dbName = 'tech_radar_db'
// Create an InfluxDB database
influx.createDatabase(dbName);
console.log(dbName);