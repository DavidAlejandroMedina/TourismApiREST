// const express = require('express')
// const app = express()

// app.get('/', function (req, res) {
//     res.send('Hello World')
// })

// app.listen(3000)

require('dotenv').config();
const Server = require('./models/server');

const server = new Server();

server.listen();