var map,
	markers = [];

var Restaurant = function (restaurantData, map) {
	var self = this;
	self.name = restaurantData.name;
	self.address = restaurantData.address;
	self.position = restaurantData.position;
	self.map = map;

	self.marker = new google.maps.Marker({
		icon: 'img/yellow-pin.png',
		position: self.position,
		title: self.name,
		map: self.map,
		animation: google.maps.Animation.DROP
    });

	self.addMarkerListeners(self.marker);
};

Restaurant.prototype.addMarkerListeners = function(marker) {
	var self = this;
	var infoWindow = new google.maps.InfoWindow();

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
	indianRestaurants.forEach(function(r) {
		self.restaurantList.push(new Restaurant(r, map));
	});
};

function initMap () {
	// Create the map
	map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.8, lng: -86.1581},
        zoom: 11,
        styles: MAP_STYLES,
        mapTypeControl: false
    });

	// Re-center map when page is resized
    google.maps.event.addDomListener(window, 'resize', function() {
    	var center = map.getCenter();
    	google.maps.event.trigger(map, 'resize');
    	map.setCenter(center);
    });

    ko.applyBindings(new ViewModel(map));
}

