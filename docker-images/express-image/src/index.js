var Chance = require('chance');
var chance = new Chance();

var express = require('express');
var app = express();

app.get('/test', function(req,res){
	res.send("Say hello to my little test");
});

app.get('/', function(req, res){
	res.send( generateLocations());
});

app.listen(3000, function(){
	console.log('Accepting HTTP requests on port 3000.');
});

//quick function that generates a random location : random city in random state in random country
function generateLocations(){
	var numberOfLocations = chance.integer({min: 0, max: 10});
	console.log("Creating " + numberOfLocations + " random locations ...");
	var locations = [];
	for(var i = 0; i < numberOfLocations; ++i){
		var city = chance.city();
		var state = chance.state({full: true});
		var country = chance.country({full: true});
		locations.push({
			city: city,
			state: state,
			country: country
		});
	}
	console.log(locations);
	return locations;
}