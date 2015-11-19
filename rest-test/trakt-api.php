<?php
//'https://api-v2launch.trakt.tv/users/louisking/lists/tvfollowing/items'
$url = $_GET["url"];
// call trakt rest api from local server to defeat CORS problem...
listTV();

// get all...
function listTV () {
  $options = array(
    'http'=>array(
    'method'=>"GET",
    'header'=>"trakt-api-version: 2\r\n" .
      "trakt-api-key: 57e188bcb9750c79ed452e1674925bc6848bd126e02bb15350211be74c6547af\r\n"
    )
  );
  $context=stream_context_create($options);
  $data=file_get_contents($_GET["url"],false,$context);
  header("Content-Type", "application/json");
  echo json_encode($data, JSON_FORCE_OBJECT);
};

?>
