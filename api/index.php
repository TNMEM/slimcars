<?php

// use Slim and NotORM
require 'vendor/autoload.php';
// ...another way...
//require 'vendor/slim/slim/Slim/Slim.php';
//\Slim\Slim::registerAutoloader();
require 'plugins/NotORM.php';
$app = new \Slim\Slim();

/* Database Configuration for NotORM */
$dbhost   = 'awsmysql.cuuagsmfyvhg.us-east-1.rds.amazonaws.com';
$dbuser   = 'GARAGE';
$dbpass   = 'GARAGE';
$dbname   = 'garage';
// get it open...
$dsn      = 'mysql:host='.$dbhost.';dbname='.$dbname;
$pdo = new PDO($dsn, $dbuser, $dbpass);
$db = new NotORM($pdo);

/* Routes */

// Home route ... not actually part of REST api...
$app->get('/', function(){
    echo 'Home - My Slim Application';
});

// Get all cars
$app->get('/cars', function() use($app, $db){
    $cars = array();
    foreach ($db->cars() as $car) {
        $cars[]  = array(
            'id' => $car['id'],
            'year' => $car['year'],
            'make' => $car['make'],
            'model' => $car['model']
        );
    }
    $app->response()->header("Content-Type", "application/json");
    echo json_encode($cars, JSON_FORCE_OBJECT);
});

// Get a single car
$app->get('/cars/:id', function($id) use ($app, $db) {
    $app->response()->header("Content-Type", "application/json");
    $car = $db->cars()->where('id', $id);
    if($data = $car->fetch()){
        echo json_encode(array(
            'id' => $data['id'],
            'year' => $data['year'],
            'make' => $data['make'],
            'model' => $data['model']
        ));
    }
    else{
        echo json_encode(array(
            'status' => false,
            'message' => "Car ID $id does not exist"
        ));
    }
});

// Add a new car
$app->post('/cars', function() use($app, $db){
    $app->response()->header("Content-Type", "application/json");
    $car = $app->request()->post();
    $result = $db->cars->insert($car);
    echo json_encode(array('id' => $result['id']));
});

// Update a car
$app->put('/cars/:id', function($id) use($app, $db){
    $app->response()->header("Content-Type", "application/json");
    $car = $db->cars()->where("id", $id);
    if ($car->fetch()) {
        $post = $app->request()->put();
        $result = $car->update($post);
        echo json_encode(array(
            "status" => (bool)$result,
            "message" => "Car updated successfully"
            ));
    }
    else{
        echo json_encode(array(
            "status" => false,
            "message" => "Car id $id does not exist"
        ));
    }
});

// Remove a car
$app->delete('/cars/:id', function($id) use($app, $db){
    $app->response()->header("Content-Type", "application/json");
    $car = $db->cars()->where('id', $id);
    if($car->fetch()){
        $result = $car->delete();
        echo json_encode(array(
            "status" => true,
            "message" => "Car deleted successfully"
        ));
    }
    else{
        echo json_encode(array(
            "status" => false,
            "message" => "Car id $id does not exist"
        ));
    }
});

/* Finally ... Run the application */
$app->run();