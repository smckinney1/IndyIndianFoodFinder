/*TODO: Consider implementing favorites and/or notes about each location, saved to local storage*/
/*TODO: Consider using Distance Matrix API to calculate commute time to each destination (in Understanding API Services section) */
/*TODO: Consider using Directions API to provide directions. */
/*TODO: Add Places library to show reviews*/
/*TODO: Add Yelp API calls*/

// TODO: Project should adhere to Knockout/MVMM framework

// Map styles courtesy of https://snazzymaps.com/style/128473/pink
// Map pins courtesy of Maps Icons Collection https://mapicons.mapsmarker.com

var map,
	markers = [];

function initMap() {
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
    		icon: 'img/yellow-pin.png',
    		position: position,
    		title: name,
    		map: map,
    		animation: google.maps.Animation.DROP
       	});

       	// Add the marker to the array of markers
       	markers.push(marker);

       	/****** MARKER WINDOW LISTENERS ******/

       	//Create info window
       	marker.addListener('click', function() {
       		infoWindow.setContent('<div id="info-window">' + '<h3>' + restaurant.name + '</h3>' 
       			+ '<p>' + restaurant.address + '</p>' + '</div>');
       		infoWindow.open(map, marker);
       	});


       	//Change marker appearance on mouseover/mouseout
       	marker.addListener('mouseover', function() {
       		this.setIcon('img/orange-pin.png');
       	});

       	marker.addListener('mouseout', function() {
       		this.setIcon('img/yellow-pin.png');
       	});
    });

    // TODO: Determine if necessary to use function to populate infoWindow
    function populateInfoWindow(marker) {
    	//
    }
}