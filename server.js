const express = require('express');
const app = express();
const path = require('path');
const engine = require('ejs');
const routes = require('./routes');

//everything in public gets served
app.use(express.static(__dirname + '/public'));

app.engine('ejs', engine.renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//app.get('/partials/:filename', routes.partials);

app.get('/', (req, res, next) => {
   res.render('index');
});

// /api/get_cities
//sample call: http://localhost:1337/api/randomair/get_airports
app.use('/api', routes);

app.get('/:page', (req, res, next) => {
   res.render(req.params.page);
});

//route for angular
app.use('/angular', express.static(__dirname + '/node_modules/angular/'));
app.use('/angular-ui-router', express.static(__dirname + '/node_modules/angular-ui-router/release/'));

//catch errors, show friendly err page
app.use((err, req, res, next) => {
   res.status(err.statusCode).send('Uh oh!');
});

//get the port
const port = process.env.PORT || 1337;

app.listen(port, () => {
   console.log('listening to port ' + port);
});