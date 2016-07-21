console.log('main.js loaded');

var nav = navigator.geolocation; // get back nav object
var coords = {};
var evArr = [];
var search = document.querySelector('#search-button');
var artist = document.querySelector('#artist-box');

search.addEventListener('click', function(e) {
  e.preventDefault();

  var artistReq = artist.value.toLowerCase();
  console.log('search button clicked, INPUT:', artistReq);
  var beURL = 'http://localhost:3000';
  var data = {
    artist: artistReq
  }

  $.ajax({
    url: beURL + '/planner/search',
    data: data,
    method: 'POST',
    dataType: 'json'
  }).done(function(response) {
    console.log("response:", response);
    makeEventO(response);
    dispEv(evArr, artistReq);
  }); // end ajax
});

function makeEventO(resp) {
  var evObj = {};
  for (var i=0; i<resp.length; i++) {

    for (var prop in resp[i]) {

      if (prop === 'venue') {
        evObj['name'] = (resp[i]).venue.name;
        evObj['city'] = (resp[i]).venue.city;
        evObj['region'] =(resp[i]).venue.region;
        evObj['latitude'] = parseFloat(resp[i].venue.latitude);
        evObj['longitude'] = parseFloat(resp[i].venue.longitude);
      }
      if (prop === 'formatted_datetime') {
        evObj['formatted_datetime'] = (resp[i])[prop];
      }
      if (prop === 'ticket_status') {
        evObj['ticket_status'] = (resp[i])[prop];
      }
      if (prop === 'ticket_url') {
        evObj['ticket_url'] = (resp[i])[prop];
      }
    }
    evArr.push(evObj);
    evObj = {}; // clear out the old contents
  }
  console.log('eventArr:', evArr);
  return evArr;
}

function dispEv(evArr, artist) {
  var name = artist.toUpperCase();
  var results = document.querySelector('#results');
  var div = document.createElement('div');
  div.classList.add('event');
  var header = document.createElement('h3');
  var text = document.createTextNode(name);
  header.appendChild(text);
  div.appendChild(header);
  results.appendChild(div);

  for (var i=0; i<=3; i++) {
    var ul = document.createElement('ul');
    var addFav = document.createElement('button');
    var buttonText = document.createTextNode('Add to calendar');
    addFav.classList.add('favorite-button');
    addFav.appendChild(buttonText);
    div.appendChild(ul);
    div.appendChild(addFav);
    // initListener(addFav, evArr[i]);

    for (var prop in evArr[i]) {
      if (prop === 'name') {
        var li = document.createElement('li');
        var liText = document.createTextNode((evArr[i])[prop]);
        li.appendChild(liText);
        ul.appendChild(li);
      }

      if (prop === 'formatted_datetime') {
        var li = document.createElement('li');
        var liText = document.createTextNode((evArr[i])[prop]);
        li.appendChild(liText);
        ul.appendChild(li);
      }

      if (prop === 'ticket_status' && evArr[i][prop] === 'available') {
        var li = document.createElement('li');
        var anc = document.createElement('a');
        var ancText = document.createTextNode('Buy Tickets Online');
        anc.appendChild(ancText);
        anc.setAttribute('href', evArr[i]['ticket_url']);
        anc.setAttribute('target', '_blank');
        li.appendChild(anc);
        ul.appendChild(li);
      } else if (prop === 'ticket_status' && evArr[i][prop] === 'unavalable') {
        var li = document.createElement('li');
        var liText = document.createTextNode('Tickets sold out');
        li.appendChild(liText);
        ul.appendChild(li);
      }

      if (prop === 'city') {
        var li = document.createElement('li');
        var liText = document.createTextNode((evArr[i])[prop] + ', ' + evArr[i]['region']);
        li.appendChild(liText);
        ul.appendChild(li);
      }
    }
  }
}

nav.getCurrentPosition(function(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;

  coords['lat'] = lat;
  coords['lon'] = lon;

  console.log('USER LAT: ' + coords.lat + ' DEG');
  console.log('USER LON: ' + coords.lon + ' DEG');

  initMap(coords.lat, coords.lon);
});

function initMap(lat, lon) {
  console.log('initializing map...');

  var map = new google.maps.Map(document.querySelector('#map'), {
    center: {lat: 39.8, lng: -98.6},
    scrollwheel: false,
    zoom: 1
  });

  var marker = new google.maps.Marker({
    position: {lat: parseFloat(lat), lng: parseFloat(lon)},
    map: map,
  });
}
