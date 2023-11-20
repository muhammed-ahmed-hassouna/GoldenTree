const express = require('express');
const payment_route = express();

const bodyParser = require('body-parser');
payment_route.use(bodyParser.json());
payment_route.use(bodyParser.urlencoded({ extended:false }));

const path = require('path');

payment_route.set('view engine','ejs');
payment_route.set('views',path.join(__dirname, '../views'));

const paymentController = require('../Controllers/paymentController');

payment_route.get('/buy', paymentController.renderBuyPage);
payment_route.post('/payment', paymentController.payment);
payment_route.get('/home', paymentController.success);
payment_route.get('/failure', paymentController.failure);

module.exports = payment_route;


