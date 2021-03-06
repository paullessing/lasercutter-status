///<reference path='../typings/tsd.d.ts' />

import { LaserCutterService } from './services/LaserCutterService';
import { NotificationService } from './services/NotificationService';
import { DurationService } from './services/DurationService';
import { Tool } from './entities/tool';
import { Status } from './entities/status';
import { Notification } from './entities/notification';

var port = 8090;

// Instructions from https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular

// set up ========================
import express        = require('express');
import mongoose       = require('mongoose');        // mongoose for mongodb
import morgan         = require('morgan');          // log requests to the console (express4)
import bodyParser     = require('body-parser');     // pull information from HTML POST (express4)
//import methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
import path           = require('path');
var app               = express();                  // create our app w/ express

import { CronJob } from 'cron';

mongoose.connect('mongodb://localhost:27017/lasercutter_status');

// view engine setup
app.set('views', path.join(__dirname, '..', 'resources/views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, '..', 'public')));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended': true }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
//app.use(methodOverride('X-HTTP-Method-Override'));

app.get('/', (req: express.Request, res: express.Response) => {
    var statusPromise: Promise<Status> = req.query['debug'] ? Promise.resolve({
        fetchedAt: new Date(),
        isUp: req.query['debug'] === 'up',
        isInUse: typeof req.query['inUse'] !== 'undefined',
    }) : LaserCutterService.getStatus(typeof req.query['force'] !== 'undefined');

    var addStatus = (typeof req.query['success'] !== 'undefined') ? 'success' :
        (typeof req.query['failure'] !== 'undefined') ? req.query['failure'] === 'email' ? 'email' : 'failure' : null;

    statusPromise.then(laserCutter => {
        res.render('index', {
            statusYesNo: laserCutter.isUp ? 'Yes' : 'No',
            isUp: laserCutter.isUp,
            inUse: laserCutter.isInUse,
            status: laserCutter.isUp ? 'up' : 'down',
            addSuccess: addStatus === 'success',
            addFailure: addStatus === 'failure',
            emailFailure: addStatus === 'email'
        });
    }).catch(err => {
        res.status(500).end();
    });
});

app.post('/notifyme', (req: express.Request, res: express.Response) => {
    var email = req.body['email'];

    console.log("Requesting notification", email);

    NotificationService.requestNotification(email).then(() => {
        res.redirect('/?success');
    }).catch(err => {
        if (err === 'invalid-email') {
            res.redirect('/?failure=email')
        } else {
            console.log("Error submitting email", err);
            res.redirect('/?failure');
        }
    });
});

app.post('/notify', (req: express.Request, res: express.Response) => {
    NotificationService.executeNotify();
    res.status(200).end();
});

app.get('/howlonguntilitisfixed', (req: express.Request, res: express.Response) => {
    LaserCutterService.getStatus().then(laserCutter => {
        if (laserCutter.isUp) {
            res.redirect('/');
        } else {
            res.render('duration', {
                endDate: DurationService.getTime(),
                reason: DurationService.getReason()
            });
        }
    })
});

app.get('/status', (req: express.Request, res: express.Response) => {
    LaserCutterService.getStatus(true).then(laserCutter => {
        console.log(laserCutter);
        return {
            status: laserCutter.isUp ? 'UP' : 'DOWN',
            inUse: laserCutter.isInUse,
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

new CronJob('00 */57 * * * *', () => {
    console.log("Cronjob running");
    LaserCutterService.getStatus(true).catch(err => {
        console.error("Oops cron", err);
    }); // Force a fetch and possibly a notify
}).start();