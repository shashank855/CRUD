var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
const mongoConnection = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8090;
var router = express.Router();

// MongoDB URL for database connection
const dbHost = `${process.argv[2]}/mydb`;
console.log("Mongo DB Host URI:"+dbHost);

// Connect to mongodb
mongoConnection.connect(dbHost, {useMongoClient: true});

module.exports = mongoConnection;



var mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
var employeeschema   = new Schema({
    Name: String,
    company: String,
    post : String
});

var User = mongoose.model('user', employeeschema);
// Middle Route 

router.use(function (req, res, next) {
    // do logging 
    // do authentication 
    //mongoConnection.connect('mongodb://localhost:27017/mydb', {useMongoClient: true});
    console.log('Logging of request will be done here');
    next(); // make sure we go to the next routes and don't stop here
});

// test route is used to test wheteher REST API is running properly ot not 
router.route('/test').get(function (req, res) {
    console.log("API is live")
    if(mongoConnection){
        console.log("DB Connected Successfully")
    }
    else{
        console.log("DB Not Connected Successfully")
    }
    res.send("API is live and DB Connected Successfully")
});

// GET to /users : To list all the users present in the collection
// Here the collection is 'employees'
router.route('/users').get(function (req, res) {
        console.log("Fetching all users")
        User.find(function (err, users) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            console.log(users);
            res.json(users);
        });
    });

// POST to /users : To create a users record in the collection
// Here the collection is 'employees'
router.route('/users').post(function (req, res) {
        console.log("Creating a user record");
        var p = new User();
        p.id = req.body.id
        p.Name = req.body.Name
        p.company = req.body.company
        p.post = req.body.post
        p.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.send({ message: 'User Created !' })
        })
    });

    


app.use(cors());
app.use('/', router);
app.listen(port);
console.log('REST API is runnning at ' + port);
