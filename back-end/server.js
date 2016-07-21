var express     = require('express');
var cors        = require('cors');
var bodyParser  = require('body-parser');
var mongodb     = require('mongodb');
var request     = require('request');
var app         = express();

/* let's add the ability ajax to our server from anywhere! */
app.use(cors());

/* extended:true = put it in an obj */
app.use(bodyParser.urlencoded({extended: true}));

/* MongoClient lets us interface/connect to mongodb */
var MongoClient = mongodb.MongoClient;

/* Connection url where your mongodb server is running. */
var mongoUrl = 'mongodb://localhost:27017/api-project';

/* bands in town api search */
app.post('/planner/search', function(req, res) { // posting to localhost:3000/planner/search

  var endpoint = 'http://api.bandsintown.com/artists/';
  var searchInput = req.body.artist
  var format = '/events.json?api_version=2.0&app_id=';
  var end = 'BAND_PLANNER_APP';
  var fullQuery = endpoint + searchInput + format + end;
  console.log('fullQuery:', fullQuery); // prints to terminal

  request({
    url: fullQuery,
    method: 'GET',
    callback: function(error, response, body) {
      res.send(body);
    }
  })
}); // end post request

/* last.fm auth */
app.get('/planner/auth', function(req, res) {

  var url = 'http://www.last.fm/api/auth';
  var LAST_FM_API_KEY = process.env.LAST_FM_API_KEY;
  var fullQuery = url + '/?api_key' + LAST_FM_API_KEY;
  console.log('fullQuery:', fullQuery);

  request({
    url: fullQuery,
    method: 'GET',
    callback: function(error, response, body) {
      console.log(body);
  }
})
})

/* last.fm api search */
app.post('/planner/song', function(req, res) {

  // ex url
  // /2.0/?method=artist.gettoptracks&artist=cher&api_key=YOUR_API_KEY&format=json

  var endpoint = '/2.0/?method=artist.gettoptracks&artist=cher';

  var LAST_FM_API_KEY = process.env.LAST_FM_API_KEY;
  var format = '&format=json'
  var fullQuery = endpoint + '&api_key=' + LAST_FM_API_KEY + format

  request({
    url: fullQuery,
    method: 'GET',
    callback: function(error, response, body) {
      res.send(body);
    }
  })

  auth.getSession(token, api_key, api_sig)

})

app.listen(3000, function(){
  console.log('listen to events on a "port".')
});
