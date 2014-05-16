<?php

$target_path = "/Users/dean/Sites/Uploads/";
$target_path = $target_path . basename( $_FILES['uploadedfile']['name']);

/*echo "Destination=" .   $destination_path . "<br />";
echo "Target path=" .   $target_path . "<br />";
echo "Size=" .          $_FILES['uploadedfile']['size'] . "<br />";
echo "Temporary Location="	.			$_FILES['uploadedfile']['tmp_name'] . "<br/>";*/

if(move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $target_path)) {
	#echo "The file ".  basename( $_FILES['uploadedfile']['name']). " has been uploaded";
	#ob_start();
	header('location: http://localhost/~dean/open_layers/image-layer/image-layer.html');
	#echo "<script type='text/javascript'>alert('dean was here');</script>";
	#ob_end_flush();
} 
else{
	echo "There was an error uploading the file, please try again!";
}
?>