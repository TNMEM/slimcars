$(document).ready(function() {
  // jQuery...
  
  var rootAPI = "//api.github.com/users/tnmem/subscriptions";
  var subs; // the subscriptions/watching repositories...
  
  findAll();
  
  // Retrive show details when list item is clicked
  $(document).on('click', 'ul#git-list li a', function(e) {
  	e.preventDefault();
  	var anID = $(this).data('id');
  	$.map(subs, function(git) {
      if (git.id == anID) {
        console.log("Found: ", anID, git.id);
			  $('#git-description').html('Go To: <a href="' + git.html_url + '" target="_blank">' + git.full_name + '</a><br>' + git.description);
      }
    });
  });

  // Get all using PHP on same server to defeat CORS problem...
  function findAll() {
		var fa = $.ajax({
			type: 'GET',
			url: rootAPI + "?per_page=100",
			dataType: 'json'
	  });
		fa.done(function(response){
		  subs = response;
			console.log('Done: ', subs);
			renderList(subs);
		});
		fa.fail(function(xhr, type){
		   console.log(xhr, type);
		});
  }
  
  // Render list
	function renderList(data) {
		$('#git-list li').remove();
		$('#git-description').html('');
		$.each(data, function(i, git) {
			$('#git-list').append('<li><a href="#" data-id="' + git.id + '">'  + git.full_name + '</a><br><span id="sorter">' + git.pushed_at + '</span></li>');
		});
		tinysort('#git-list>li',{selector:'span',order:'desc'});
	}

});
