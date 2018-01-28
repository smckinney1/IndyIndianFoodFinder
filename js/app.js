var map,
	markers = [],
	locations = [],
	infoWindow,
	venue, 
	checkInCount, 
	rating, 
	ratingColor, 
	hereNow, 
	bestPhotoHTML;

var Restaurant = function (restaurantData, map, checkInCount, rating, ratingColor, hereNow, bestPhotoHTML) {
	var self = this;
	self.name = restaurantData.name;
	self.address = restaurantData.address;
	self.position = restaurantData.position;
	self.map = map;
	self.checkInCount = checkInCount;
	self.rating = rating;
	self.ratingColor = ratingColor;
	self.hereNow = hereNow;
	self.bestPhotoHTML = bestPhotoHTML;

	self.marker = new google.maps.Marker({
		icon: 'img/yellow-pin.png',
		position: self.position,
		title: self.name,
		map: self.map,
		animation: google.maps.Animation.DROP
    });

	self.addMarkerListeners(self.marker);
	markers.push(self.marker);

	// TODO: Remove
	console.log(this);
};

Restaurant.prototype.addMarkerListeners = function(marker) {
	var self = this;

	//Create info window
   	marker.addListener('click', function() {
   		infoWindow.setContent('<div id="info-window">' + '<h3>' + self.name + '</h3>' 
   			+ '<p>' + self.address + '</p>' + '</div>');
   		infoWindow.open(map, marker);
   	});

   	//Change marker appearance on mouseover/mouseout
   	marker.addListener('mouseover', function() {
   		this.setIcon('img/orange-pin.png');
   	});

   	marker.addListener('mouseout', function() {
   		this.setIcon('img/yellow-pin.png');
   	});
};

var ViewModel = function(map) {
	var self = this;
	this.map = map;

	self.restaurantList = ko.observableArray([]);
	indianRestaurants.forEach(function(restaurant) {
		var url = FS_ENDPOINT + restaurant.foursquareID + FS_QUERY_STRING;

		// API call to FourSquare
		// TODO: Should this be called in the ViewModel or Model?
		// TODO: Change the error handling
		fetch(url)
			.then( response => response.json() )
			.then( data => {
				venue = data.response.venue;
				checkInCount = venue.stats.checkinsCount;
				rating = venue.rating;
				ratingColor = venue.ratingColor;
				hereNow = venue.hereNow.count;
				bestPhotoHTML = '<img src="' + venue.bestPhoto.prefix + '' + venue.bestPhoto.width + 'x' + venue.bestPhoto.height  + venue.bestPhoto.suffix + '">';
				self.restaurantList.push(new Restaurant(restaurant, map, checkInCount, rating, ratingColor, hereNow, bestPhotoHTML));
			})
			.catch( error => console.log(error) );
	});
};

// TODO: Needed????
function hideMarkers() {
	markers.forEach(function(marker) {
		marker.setMap(null);
	});
}

function initMap () {
	// Create the map
	map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.8, lng: -86.1581},
        zoom: 11,
        styles: MAP_STYLES,
        mapTypeControl: false
    });

	// Creating the info window, which will be modified any time
	// a user clicks on a marker
    infoWindow = new google.maps.InfoWindow();

	// Re-center map when page is resized
    google.maps.event.addDomListener(window, 'resize', function() {
    	var center = map.getCenter();
    	google.maps.event.trigger(map, 'resize');
    	map.setCenter(center);
    });

    ko.applyBindings(new ViewModel(map));
}

