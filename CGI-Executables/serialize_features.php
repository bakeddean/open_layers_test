<?php

	$striped_json = stripslashes($_POST['data']);
	$json = json_decode($striped_json, true);

	debug_to_console($json['features'][0]['geometry']);

	$output_file = "/Users/dean/Sites/Uploads/data.geojson";
	file_put_contents ($output_file , $striped_json);

	//$output = "<script>window.alert('Wrote file');</script>";
	$output = "<script>$('#message-box').show().html('Wrote file').delay(3000).fadeOut(500);</script>";
	echo $output; 

	/*foreach ($json as $name => $value) {
    	echo $name . ':';
    	if(gettype($value) === "array"){
    		foreach ($value as $entry) {
     	    	echo '  ' . $entry;//->firstName;
    		}
    	}
	}*/
	//debug_to_console(json_last_error());

	/*switch (json_last_error()) {
        case JSON_ERROR_NONE:
            echo ' - No errors';
        break;
        case JSON_ERROR_DEPTH:
            echo ' - Maximum stack depth exceeded';
        break;
        case JSON_ERROR_STATE_MISMATCH:
            echo ' - Underflow or the modes mismatch';
        break;
        case JSON_ERROR_CTRL_CHAR:
            echo ' - Unexpected control character found';
        break;
        case JSON_ERROR_SYNTAX:
            echo ' - Syntax error, malformed JSON';
        break;
        case JSON_ERROR_UTF8:
            echo ' - Malformed UTF-8 characters, possibly incorrectly encoded';
        break;
        default:
            echo ' - Unknown error';
        break;
    }*/


	//if($json === null){
	//	echo "Json is null";
	//}

	function debug_to_console($data) {
    	if ( is_array( $data ) )
        	$output = "<script>console.log( 'Debug Objects: " . implode( ',', $data) . "' );</script>";
    	else
        	$output = "<script>console.log( 'Debug Objects: " . $data . "' );</script>";
    	echo $output;
	}
?>