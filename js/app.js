var map,
	markers = [];

var Restaurant = function (data) {
	var self = this;
	self.name = data.name;
	self.address = data.address;
	self.position = data.position;

	//TODO: Ensure map is set later
	/* self.marker = new google.maps.Marker({
		icon: 'img/yellow-pin.png',
		position: self.position,
		title: self.name,
		map: null,
		animation: google.maps.Animation.DROP
    }); */

	//TODO: infoWindow
};

var MapViewModel = function() {
	var self = this;

	self.restaurantList = ko.observableArray([]);
	indianRestaurants.forEach(function(r) {
		self.restaurantList.push(new Restaurant(r));
	});

	
};

function initMap () {
	var styles = [
	    {
	        "featureType": "administrative",
	        "elementType": "labels.text.fill",
	        "stylers": [
	            {
	                "color": "#e85113"
	            }
	        ]
	    },
	    {
	        "featureType": "administrative",
	        "elementType": "labels.text.stroke",
	        "stylers": [
	            {
	                "color": "#ffffff"
	            },
	            {
	                "weight": 6
	            }
	        ]
	    },
	    {
	        "featureType": "administrative.locality",
	        "elementType": "geometry",
	        "stylers": [
	            {
	                "visibility": "on"
	            },
	            {
	                "color": "#cd0064"
	            }
	        ]
	    },
	    {
	        "featureType": "administrative.locality",
	        "elementType": "geometry.stroke",
	        "stylers": [
	            {
	                "color": "#cd0064"
	            }
	        ]
	    },
	    {
	        "featureType": "administrative.locality",
	        "elementType": "labels.text",
	        "stylers": [
	            {
	                "color": "#cd0064"
	            }
	        ]
	    },
	    {
	        "featureType": "administrative.locality",
	        "elementType": "labels.text.stroke",
	        "stylers": [
	            {
	                "color": "#ffffff"
	            }
	        ]
	    },
	    {
	        "featureType": "landscape",
	        "elementType": "all",
	        "stylers": [
	            {
	                "lightness": 20
	            },
	            {
	                "color": "#efe9e4"
	            }
	        ]
	    },
	    {
	        "featureType": "landscape",
	        "elementType": "labels",
	        "stylers": [
	            {
	                "visibility": "off"
	            }
	        ]
	    },
	    {
	        "featureType": "landscape.man_made",
	        "elementType": "all",
	        "stylers": [
	            {
	                "visibility": "off"
	            }
	        ]
	    },
	    {
	        "featureType": "poi",
	        "elementType": "geometry",
	        "stylers": [
	            {
	                "visibility": "on"
	            },
	            {
	                "color": "#f0e4d3"
	            }
	        ]
	    },
	    {
	        "featureType": "poi",
	        "elementType": "labels",
	        "stylers": [
	            {
	                "visibility": "simplified"
	            }
	        ]
	    },
	    {
	        "featureType": "poi",
	        "elementType": "labels.text.fill",
	        "stylers": [
	            {
	                "hue": "#11ff00"
	            }
	        ]
	    },
	    {
	        "featureType": "poi",
	        "elementType": "labels.text.stroke",
	        "stylers": [
	            {
	                "lightness": 100
	            }
	        ]
	    },
	    {
	        "featureType": "poi",
	        "elementType": "labels.icon",
	        "stylers": [
	            {
	                "hue": "#4cff00"
	            },
	            {
	                "saturation": 58
	            }
	        ]
	    },
	    {
	        "featureType": "road",
	        "elementType": "labels.text.fill",
	        "stylers": [
	            {
	                "lightness": -100
	            }
	        ]
	    },
	    {
	        "featureType": "road",
	        "elementType": "labels.text.stroke",
	        "stylers": [
	            {
	                "lightness": 100
	            }
	        ]
	    },
	    {
	        "featureType": "road.highway",
	        "elementType": "geometry.fill",
	        "stylers": [
	            {
	                "color": "#efe9e4"
	            },
	            {
	                "lightness": -25
	            }
	        ]
	    },
	    {
	        "featureType": "road.highway",
	        "elementType": "geometry.stroke",
	        "stylers": [
	            {
	                "color": "#efe9e4"
	            },
	            {
	                "lightness": -40
	            }
	        ]
	    },
	    {
	        "featureType": "road.arterial",
	        "elementType": "geometry.fill",
	        "stylers": [
	            {
	                "color": "#efe9e4"
	            },
	            {
	                "lightness": -10
	            }
	        ]
	    },
	    {
	        "featureType": "road.arterial",
	        "elementType": "geometry.stroke",
	        "stylers": [
	            {
	                "color": "#efe9e4"
	            },
	            {
	                "lightness": -20
	            }
	        ]
	    },
	    {
	        "featureType": "water",
	        "elementType": "all",
	        "stylers": [
	            {
	                "color": "#19a0d8"
	            }
	        ]
	    },
	    {
	        "featureType": "water",
	        "elementType": "labels.text.fill",
	        "stylers": [
	            {
	                "lightness": -100
	            }
	        ]
	    },
	    {
	        "featureType": "water",
	        "elementType": "labels.text.stroke",
	        "stylers": [
	            {
	                "lightness": 100
	            }
	        ]
	    }
	];

	// Create the map
	map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.8, lng: -86.1581},
        zoom: 11,
        styles: styles,
        mapTypeControl: false
    });

	// Re-center map when page is resized
    google.maps.event.addDomListener(window, 'resize', function() {
    	var center = map.getCenter();
    	google.maps.event.trigger(map, 'resize');
    	map.setCenter(center);
    });

    //var infoWindow = new google.maps.InfoWindow();
}

var mapViewModel = new MapViewModel();
ko.applyBindings(mapViewModel);