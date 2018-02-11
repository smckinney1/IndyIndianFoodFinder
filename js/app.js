var map,
	markers = ko.observableArray([]),
	locations = [],
	infoWindow,
	venue, 
	checkInCount, 
	rating, 
	ratingColor, 
	hereNow, 
	bestPhotoHTML,
	filter;

$('#sidebar').on('click', function() {
	$('#sidebar').toggleClass('move');
});

var Restaurant = function (restaurantData, checkInCount, rating, ratingColor, hereNow, bestPhotoHTML) {
	var self = this;
	// Data from model.js
	self.name = restaurantData.name;
	self.address = restaurantData.address;
	self.position = restaurantData.position;
	self.foursquareID = restaurantData.foursquareID;

	// Data from API call to FourSquare
	if (arguments.length > 1) {
		self.checkInCount = checkInCount;
		self.rating = rating;
		self.ratingColor = ratingColor;
		self.hereNow = hereNow;
		self.bestPhotoHTML = bestPhotoHTML;
	}

	self.marker = new google.maps.Marker({
		icon: 'img/yellow-pin.png',
		position: self.position,
		title: self.name,
		map: null,
		animation: google.maps.Animation.DROP
    });

	self.addMarkerListeners(self.marker);
	markers().push(self.marker);
};

Restaurant.prototype.addMarkerListeners = function(marker) {
	var self = this;

	// Create info window
   	marker.addListener('click', function() {
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

Restaurant.prototype.createInfoWindowHTML = function() {
	var foursquareListHTML;

	// Making sure the FourSquare data was loaded before displaying the list
	if (typeof this.hereNow === 'number' && typeof this.checkInCount === 'number' && (typeof this.rating === 'number' || typeof this.rating === 'string')) {
		foursquareListHTML  = 
			'<ul>'
	   			+ '<li class="info-window-li">Here Now: ' + this.hereNow + '</li>'
	   			+ '<li class="info-window-li">Check-in Count: ' + this.checkInCount + '</li>'
	   			+ '<li class="info-window-li" id="rating">Rating: ' + this.rating + '</li>'
	   		+ '</ul>';
	} else {
		foursquareListHTML = '<p><em>An error occurred fetching Foursquare data for this restaurant.</em></p>';
	}

	return '<div id="info-window">' + (this.bestPhotoHTML ? this.bestPhotoHTML : '') 
				+ '<h3>' + this.name + '</h3>' 
	   			+ '<p>' + this.address + '</p>' 
	   			+ '<a href="' + FS_BASE_URL + this.foursquareID + '" target="_blank" alt="FourSquare logo" title="Visit on FourSquare"><img id="fs-img" src="img/FourSquare_Social.png"></a>'
	   			+ foursquareListHTML
   			+ '</div>';
};

var ViewModel = function() {
	var self = this;
	self.restaurantList = ko.observableArray([]);
	self.searchQuery = ko.observable('');
	self.totalLoaded = 0;
	self.restaurantsWithErrors = ko.observableArray([]);

	// Call FourSquare API & push to restaurant list
	indianRestaurants.forEach(function(restaurant) {
		var url = FS_ENDPOINT + restaurant.foursquareID + FS_QUERY_STRING;

		fetch(url)
			.then( response => response.json() )
			.then( data => {
				venue = data.response.venue;
				checkInCount = venue.stats.checkinsCount;
				rating = venue.rating || 'Not available';
				ratingColor = venue.ratingColor || '';
				hereNow = venue.hereNow.count;
				bestPhotoHTML = '<img class="restPhoto" src="' + venue.bestPhoto.prefix + '' + venue.bestPhoto.width + 'x' + venue.bestPhoto.height  + venue.bestPhoto.suffix + '">';
				self.restaurantList.push(new Restaurant(restaurant, checkInCount, rating, ratingColor, hereNow, bestPhotoHTML));
				self.totalLoaded++;
				self.checkRestaurantLoad();
			})
			.catch( error => { 
				self.totalLoaded++;
				self.restaurantList.push(new Restaurant(restaurant));
				self.restaurantsWithErrors.push({ name: restaurant.name });
				self.checkRestaurantLoad();
			} );
	});

	// Open modal if errors occurred fetching Foursquare data
	self.checkRestaurantLoad = function () {
		if (self.totalLoaded === indianRestaurants.length) {
			if (self.restaurantsWithErrors().length > 0) {
				modalData.openModal();
			}
		}
	}

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
	self.filteredRestaurantList = ko.computed(() => {
		var filter = self.restaurantList().filter(item => item.name.toUpperCase().indexOf(self.searchQuery().toUpperCase()) === 0);

		// Filter the markers on screen too
		markers().forEach(function(mark) {
			if (mark.title.toUpperCase().indexOf(self.searchQuery().toUpperCase()) === 0) {
				mark.setMap(map);
			} else {
				mark.setMap(null);
			}
		});

		return filter;
	});

	// If any restaurants failed to load FourSquare data, they will also be sorted alphabetically in the resulting modal window.
	self.sortedRestaurantsWithErrors = ko.computed(() =>  {
		self.restaurantsWithErrors().sort((left, right) => {
			if (left.name == right.name) {
				return 0;
			} else if (left.name < right.name) {
				return -1;
			} else {
				return 1;
			}
		})
	});

	self.restaurantClickHandler = function() {
		// Zoom in the map and set position
		map.setZoom(16);
		map.setCenter(this.position);
		this.marker.setAnimation(google.maps.Animation.BOUNCE);

		// Marker bounce animation stops after 1.2 seconds
		setTimeout(() => {
			this.marker.setAnimation(null);
			infoWindow.setContent(this.createInfoWindowHTML());
			infoWindow.open(map, this.marker);
		}, 1200);
	}
};

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

    ko.applyBindings(new ViewModel());
}


