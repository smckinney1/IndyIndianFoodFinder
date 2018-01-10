//restaurantList

var Restaurant = function (data) {
	var self = this;
	self.name = data.name;
	self.address = data.address;
	self.position = data.position;

	//TODO:
	//marker
	//infoWindow
};

var ViewModel = function() {
	var self = this;
	self.restaurantList = ko.observableArray([]);
	indianRestaurants.forEach(function(r) {
		self.restaurantList.push(new Restaurant(r));
	});
};

ko.applyBindings(new ViewModel());