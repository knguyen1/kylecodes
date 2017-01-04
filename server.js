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

app.get('/partials/:filename', routes.partials);
app.get('/', (req, res) => {
   res.render('index', {message: 'hello!!'});
});

//route for angular
app.use('/angular', express.static(__dirname + '/node_modules/angular/'));
app.use('/angular-ui-router', express.static(__dirname + '/node_modules/angular-ui-router/release/'));

//get the port
const port = process.env.PORT || 1337;

app.listen(port, () => {
   console.log('listening to port ' + port);
});