/*TODO: Implement favorites and/or notes about each location, saved to local storage*/
// TODO: Project should adhere to Knockout/MVMM framework

var map,
	markers = [];

function initMap() {
	// Styles courtesy of https://snazzymaps.com/style/128473/pink
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

	// Instantiate the map in the DOM
	// Do not allow users to change to different views, ex: satellite
	map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.8, lng: -86.1581},
        zoom: 11,
        styles: styles,
        mapTypeControl: false
    });

    var infoWindow = new google.maps.InfoWindow();

	// Looping through all map locations to create markers
    indianRestaurants.forEach(function(restaurant) {
    	var position = restaurant.position;
    	var title = restaurant.name;

    	var marker = new google.maps.Marker({
    		position: position,
    		title: name,
    		map: map,
    		animation: google.maps.Animation.DROP
       	});

       	// Add the marker to the array of markers
       	markers.push(marker);

       	//Create info window
       	marker.addListener('click', function() {
       		infoWindow.setContent('<div id="info-window">' + '<h3>' + restaurant.name + '</h3>' + restaurant.address + '</div>');
       		infoWindow.open(map, marker);
       		//populateInfoWindow(marker);
       	});
    });

    // TODO: Determine if necessary to use function to populate infoWindow
    function populateInfoWindow(marker) {
    	//
    }
}