///<reference path='../typings/tsd.d.ts' />

var port = 8081;

// Instructions from https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular

// set up ========================
import express        = require('express');
import mongoose       = require('mongoose');        // mongoose for mongodb
import morgan         = require('morgan');          // log requests to the console (express4)
import bodyParser     = require('body-parser');     // pull information from HTML POST (express4)
//import methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
import path           = require('path');
var app               = express();                  // create our app w/ express

import { LaserCutterService } from './services/LaserCutterService';
import { Tool } from './entities/tool';

mongoose.connect('mongodb://localhost:27017/lasercutter_status');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended': true }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
//app.use(methodOverride('X-HTTP-Method-Override'));

//app.get('/:slug', (req: express.Request, res: express.Response) => {
//    linkService.get(req.params.slug, true).then(link => {
//        res.redirect(link.url, 302);
//    }, err => {
//        console.error(err);
//        res.redirect("/");
//    })
//});
//
//app.post('/create', (req: express.Request, res: express.Response) => {
//    var details: LinkDetails = req.body;
//
//    linkService.create(details).then(link => {
//        console.log("Created", link);
//        res.json({ success: true, link: link });
//    }).catch(errors => {
//        console.log("Rejected: ", errors);
//        res.send({ success: false, errors: errors }); // TODO
//    });
//});

app.get('/status', (req: express.Request, res: express.Response) => {
    LaserCutterService.getStatus(true).then(laserCutter => {
        console.log(laserCutter);
        return {
            status: laserCutter.isUp ? 'UP' : 'DOWN',
            inUse: laserCutter.isInUse
        };
    }, err => {
        console.log("Error", err);
        return {
            status: 'UNKNOWN',
            inUse: false
        };
    }).then(status => {
        res.status(200).contentType("application/json").send(status).end();
    });
});

app.listen(port);
console.log("App listening on port " + port);
