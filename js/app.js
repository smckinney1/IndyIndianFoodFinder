/****** SAMPLE CALL TO FOURSQUARE API ******/
//https://api.foursquare.com/v2/venues/4ba69308f964a520925f39e3?client_id=4QN5YREYJVRTVXRRFC3Z5RLDVVXGEIYXXJN5ER1QXJPNK2HD&client_secret=YOSEENXFZGGMTIENAUMGYPGLLFJKQLKW4WXBLTC0NVCVT2X0&v=20180101

// TODO: Handle undefined data better from FS API calls (data unavailable for this location)
// TODO: Hide other markers when a search has been applied

var map,
	markers = [],
	locations = [],
	infoWindow,
	venue, 
	checkInCount, 
	rating, 
	ratingColor, 
	hereNow, 
	bestPhotoHTML,
	filter;

var Restaurant = function (restaurantData, map, checkInCount, rating, ratingColor, hereNow, bestPhotoHTML) {
	var self = this;
	// Data from model.js
	self.name = restaurantData.name;
	self.address = restaurantData.address;
	self.position = restaurantData.position;
	self.foursquareID = restaurantData.foursquareID;

	// Required to work with map on screen
	self.map = map;

	// Data from API call to FourSquare
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
};

Restaurant.prototype.addMarkerListeners = function(marker) {
	var self = this;

	// Create info window
   	marker.addListener('click', function() {
   		// infoWindow.setContent(self.createInfoWindowHTML());

   		// TODO: This styling does not actually work
   		// $('#rating').css('background-color', self.ratingColor);
   		// infoWindow.open(map, marker);
   		marker.setAnimation(google.maps.Animation.BOUNCE);

		// Marker bounce animation stops after 1.2 seconds
		setTimeout(() => {
			marker.setAnimation(null);
			infoWindow.setContent(self.createInfoWindowHTML());
			infoWindow.open(map, marker);
		}, 1200);
   	});

   	// Change marker appearance on mouseover/mouseout
   	marker.addListener('mouseover', function() {
   		this.setIcon('img/orange-pin.png');
   	});

   	marker.addListener('mouseout', function() {
   		this.setIcon('img/yellow-pin.png');
   	});

};

// TODO: Is this in the right place? VM vs outside of the VM?
Restaurant.prototype.createInfoWindowHTML = function() {
	return '<div id="info-window">' + this.bestPhotoHTML 
			+ '<h3>' + this.name + '</h3>' 
   			+ '<p>' + this.address + '</p>' 
   			+ '<a href="' + FS_BASE_URL + this.foursquareID + '" target="_blank"><img id="fs-img" src="img/FourSquare_Social.png"></a>'
   			+ '<ul>'
	   			+ '<li class="info-window-li">Here Now: ' + this.hereNow + '</li>'
	   			+ '<li class="info-window-li">Check-in Count: ' + this.checkInCount + '</li>'
	   			+ '<li class="info-window-li" id="rating">Rating: ' + this.rating + '</li>'
   			+ '</ul></div>';
};

var ViewModel = function(map) {
	var self = this;
	self.map = map;
	self.restaurantList = ko.observableArray([]);
	self.searchQuery = ko.observable('');

	// Call FourSquare API & push to restaurant list
	indianRestaurants.forEach(function(restaurant) {
		var url = FS_ENDPOINT + restaurant.foursquareID + FS_QUERY_STRING;

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
				bestPhotoHTML = '<img class="restPhoto" src="' + venue.bestPhoto.prefix + '' + venue.bestPhoto.width + 'x' + venue.bestPhoto.height  + venue.bestPhoto.suffix + '">';
				self.restaurantList.push(new Restaurant(restaurant, map, checkInCount, rating, ratingColor, hereNow, bestPhotoHTML));
			})
			.catch( error => console.log(error) );

	});

	// Provide the DOM with a restaurant list sorted by name (automatically runs on page load)
	self.sortedRestaurantList = ko.computed(() =>  {
		self.restaurantList().sort((left, right) => {
			if (left.name == right.name) {
				return 0;
			} else if (left.name < right.name) {
				return -1;
			} else {
				return 1;
			}
		})
	});

	// The sorted restaurant list is filtered when a user begins typing in the Search box
	// Checks if the first characters in the search query are contained in the first characters of the restaurant name
	self.filteredRestaurantList = ko.computed(() => self.restaurantList().filter(item => item.name.toUpperCase().indexOf(self.searchQuery().toUpperCase()) === 0));

	self.restaurantClickHandler = function() {
		// Zoom in the map and set position
		this.map.setZoom(16);
		this.map.setCenter(this.position);
		this.marker.setAnimation(google.maps.Animation.BOUNCE);

		// Marker bounce animation stops after 1.2 seconds
		setTimeout(() => {
			this.marker.setAnimation(null);
			infoWindow.setContent(this.createInfoWindowHTML());
			infoWindow.open(map, this.marker);
		}, 1200);
	}
};

// TODO: Needed????
/*function hideMarkers() {
	markers.forEach(function(marker) {
		marker.setMap(null);
	});
}*/

function initMap () {

	// Create the map
	map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 39.8, lng: -86.1581 },
        zoom: 11,
        styles: MAP_STYLES,
        mapTypeControl: false
    });

	// Creating the info window, which will be modified any time a user clicks on a marker
    infoWindow = new google.maps.InfoWindow();

	// Re-center map when page is resized
    google.maps.event.addDomListener(window, 'resize', function() {
    	var center = map.getCenter();
    	google.maps.event.trigger(map, 'resize');
    	map.setCenter(center);
    });

    ko.applyBindings(new ViewModel(map));
}
