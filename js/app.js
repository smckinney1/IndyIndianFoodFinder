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

// Google Maps requires a function of this name be defined globally to catch authentication failures
function gm_authFailure() {
	alert('An authentication failure occurred with the Google Maps API. Please try again later.');
}

// General error handler for Maps API, such as network disconnected
function mapsError() {
	alert('An error has occurred loading Google Maps. Please try again later.');
}

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
				self.openModal();
			}
		}
	};

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
		});
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
		});
	});

	self.restaurantClickHandler = function() {
		
		// On mobile view, hide the list of restaurants if user clicks on one
		if ($('.filtered-list').hasClass('move')) {
			$('.filtered-list').removeClass('move');
		}
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
	};

	// Use CSS transition when hamburger icon is clicked in mobile view
	self.transitionFilteredList = ko.observable(false);

	self.mobileIconClickHandler = function() {
		self.transitionFilteredList(!self.transitionFilteredList());
	};

	// Error modal click handlers
	self.openModal = function() {
		$('#simple-modal').css('display', 'block');
		$('.btn-group').css('display', 'block');
	};

	self.closeModal = function() {
		$('#simple-modal').css('display', 'none');
	};
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