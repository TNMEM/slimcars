$(document).ready(function() {
  // jQuery...
  
  var aName = "louisking";
  var aList = "tvfollowing";
  var rootAPI = "trakt-api.php?url=https://api-v2launch.trakt.tv/";
  var cal; // calendar of upcoming episodes...
  
  findAll();
  
  // Retrive show details when list item is clicked
  $(document).on('click', 'ul#tv-list li a', function(e) {
  	e.preventDefault();
  	findById($(this).data('slug'));
  });

  // Get all using PHP on same server to defeat CORS problem...
  function findAll() {
	  // calender of all upcoming shows...
		var gc = $.ajax({
			type: 'GET',
			url: rootAPI + "calendars/all/shows?extended=full",
			dataType: 'json'
	  });
		gc.fail(function(xhr, type){
			console.log('gc.fail:');
			console.log(xhr, type);
		});
    // grab shows from a list...
		var gl = $.ajax({
			type: 'GET',
			url: rootAPI + 'users/' + aName + '/lists/' + aList + '/items',
			dataType: 'json'
	  });
		gl.fail(function(xhr, type){
			console.log('gl.fail:');
			console.log(xhr, type);
		});
		// wait for ajax calls to finish...
		$.when(gc, gl).done(function(r1, r2) {
			// r1 and r2 are arguments resolved for the gc and gl ajax requests, respectively.
  		// Each argument is an array with the following structure: [ data, statusText, jqXHR ]
			console.log('r1:');
      console.log(r1[0]);
      console.log('r2:');
      console.log(r2[0]);
      // technically, should wait for parse before render too...
      cal = $.parseJSON(r1[0]);
      renderList(r2[0]);
    });
	}
  
  // Get single show using PHP on same server to defeat CORS problem...
  function findById(slug) {
		var gs = $.ajax({
			type: 'GET',
			url: rootAPI + 'shows/' + slug + "?extended=full",
			dataType: 'json'
	  });
		gs.done(function(response){
			console.log('gs.done:');
			console.log(response);
			renderDetails(response);
		});
		gs.fail(function(xhr, type){
			console.log('gs.fail:');
			console.log(xhr, type);
		});
  }
  
  // Render list
	function renderList(data) {
	  var jo = $.parseJSON(data);
		$('#tv-list li').remove();
		$('#tv-description').html('');
		$.each(jo, function(i, tv) {
			$('#tv-list').append('<li><a href="#" data-slug="' + tv.show.ids.slug + '">' + tv.show.title + '</a></li>');
		});
		tinysort('#tv-list>li');
	}

  // Render show details
	function renderDetails(data) {
	  var jo = $.parseJSON(data);
		$('#tv-description').html(jo.title + "<br>" + jo.year + '<br>' + jo.overview);
		//find any upcoming episodes...
		var aSlug = jo.ids.slug;
		$.map(cal, function(tv) {
		  if (tv.show.ids.slug == aSlug) {
		  	console.log('found:');
		    console.log(tv.show.ids.slug, aSlug);
		    $('#tv-description').append('<br><br>Upcoming: ' + tv.show.network + ' ... ' + tv.first_aired + ' ... s' + tv.episode.season + 'e' + tv.episode.number + ' ... <a href="http://trakt.tv/shows/' + aSlug + '" target="_blank">'  + tv.episode.title + '</a> ... ' + tv.episode.overview);
		  }
		});
	}

});

