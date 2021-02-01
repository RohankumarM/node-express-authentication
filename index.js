const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

//MONGODB SETUP
mongoose.connect('mongodb://localhost:auth/auth', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);

const port = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(port);