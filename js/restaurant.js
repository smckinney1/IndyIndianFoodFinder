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
			'<ul>' +
	   			'<li class="info-window-li">Here Now: ' + this.hereNow + '</li>' +
	   			'<li class="info-window-li">Check-in Count: ' + this.checkInCount + '</li>' +
	   			'<li class="info-window-li" id="rating">Rating: ' + this.rating + '</li>' +
	   		'</ul>';
	} else {
		foursquareListHTML = '<p><em>An error occurred fetching Foursquare data for this restaurant.</em></p>';
	}

	return '<div id="info-window">' + (this.bestPhotoHTML ? this.bestPhotoHTML : '') +
				'<h3>' + this.name + '</h3>' +
	   			'<p>' + this.address + '</p>' +
	   			'<a href="' + FS_BASE_URL + this.foursquareID + '" target="_blank" alt="FourSquare logo" title="Visit on FourSquare"><img id="fs-img" src="img/Foursquare_Social.png"></a>'+
	   			foursquareListHTML +
   			'</div>';
};