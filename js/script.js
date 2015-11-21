$(document).ready(function() {
	// jQuery...

	var currentCar;
	// Setup the root url for the RESTful services
	// ... php_crud_api need a transform on "list"...
	/*
	var rootURL = 'php_crud_api.php/';
	function withTransform(response) {
		return php_crud_api_transform(response)['cars'];
	}
	*/
	// Setup the root url for the Slim RESTful services
	// ... Slim doesn't need transform...
	/**/
	var rootURL = '/api/';
	function withTransform(response) {
		return response;
	}
	/**/
	
	// This gets fired for every Ajax request performed on the page.
	//$.ajaxSetup({
	//	beforeSend: function( xhr ) {
	//		alert('BeforeSend');
	//	}
	//});

	// Retrieve car list when application starts
	findAll();

	// Nothing to delete in initial application state
	$('#btnDelete').hide();

	// Retrive car details when list item is clicked
	$(document).on('click', 'ul#car-list li a', function(e) {
		e.preventDefault();
		findById($(this).data('identity'));
	});

	// Call new car function when button is clicked
	$('#btnAdd').click(function() {
		newCar();
		return false;
	});

	// Call delete car function when button is clicked
	$('#btnDelete').click(function() {
		deleteCar();
		return false;
	});

	// Call add car function when save button is clicked
	$('#btnSave').click(function() {
		if($('#id').val() == ''){
			addCar();
		}else{
			updateCar();
		}
		return false;
	});

	// Hide delete button and empty out form
	function newCar() {
		$('#btnDelete').hide();
		currentCar = {};
		renderDetails(currentCar); // Display empty form
	}

	// Get all cars
	function findAll() {
		console.log('findAll');
		var fa = $.ajax({
			type: 'GET',
			url: rootURL + 'cars',
			dataType: 'json'
		});
		fa.done(function(response){
			console.log('Done: ', response);
			renderList(withTransform(response));
		});
		fa.fail(function(xhr, type){
		   console.log(xhr, type);
		});
	}

	// Get car by id
	function findById(id) {
		console.log('findById:' + id);
		var fi = $.ajax({
			type: 'GET',
			url: rootURL + 'cars/' + id,
			dataType: 'json'
		});
		fi.done(function(data){
			$('#btnDelete').show();
			console.log('findById Done: ' + data);
			currentCar = data;
			renderDetails(currentCar);
		});
		fi.fail(function(xhr, type){
		   console.log(xhr, type);
		});
	}

	// Add new car
	function addCar() {
		console.log('addCar');
		var ac = $.ajax({
			type: 'POST',
			url: rootURL + 'cars',
			dataType: 'json',
			data: $.param(getForm()), // URI encode data for request
		});
		ac.done(function(data, xhr, type, textStatus) {
			console.log(data, xhr, type, textStatus);
			alert('Car added successfully');
			$('#btnDelete').show();
			$('#id').val(data.id);
			findAll(); // reload list
		});
		ac.fail(function(xhr, type, textStatus, errorThrown) {
			console.log(xhr, type, errorThrown, textStatus);
		});
	}

	// Update a car
	function updateCar($id) {
		console.log('updateCar');
		var uc = $.ajax({
			type: 'PUT',
			url: rootURL + 'cars/' + $('#id').val(),
			dataType: 'json',
			data: $.param(getForm()) // URI encode data for request
		});
		uc.done(function(data, xhr, type, textStatus) {
			console.log(data, xhr, type, textStatus);
			alert('Car successfully updated');
			findAll(); // reload list
		});
		uc.fail(function(xhr, type, textStatus, errorThrown) {
			console.log(xhr, type, errorThrown, textStatus);
		});
	}

	// Delete a car
	function deleteCar($id) {
		console.log('deleteCar');
		var dc = $.ajax({
			type: 'DELETE',
			url: rootURL + 'cars/' + $('#id').val()
		});
		dc.done(function(data, xhr, type, textStatus) {
			console.log(data, xhr, type, textStatus);
			alert('Car successfully deleted');
			newCar(); // zero out the form
			findAll(); // reload list
		});
		dc.fail(function(xhr, type, textStatus, errorThrown) {
			console.log(xhr, type, errorThrown, textStatus);
		});
	}

	// Render list of all cars
	function renderList(data) {
		$('#car-list li').remove();
		$.each(data, function(index, car) {
			$('#car-list').append('<li><a href="#" data-identity="' + car.id + '">' + car.model + '</a></li>');
		});
	}

	// Render detail view
	function renderDetails(car) {
		if($.isEmptyObject(car)){
			$('#id').val('');
			$('#year').val('');
			$('#make').val('');
			$('#model').val('');
		}else{
			$('#id').val(car.id);
			$('#year').val(car.year);
			$('#make').val(car.make);
			$('#model').val(car.model);
		}
	}

	// Helper function to get form fields
	function getForm() {
		var car = {
			'year': $('#year').val(),
			'make': $('#make').val(),
			'model': $('#model').val()
		};
		return car;
	}

});