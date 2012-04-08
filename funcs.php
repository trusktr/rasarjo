<?php /*Declare Functions*/
	
	function is_ie() {
		if (isset($_SERVER['HTTP_USER_AGENT']) && 
		(strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== false))
			return true;
		else
			return false;
	}
	
	function is_chrome() {
		return(eregi("chrome", $_SERVER['HTTP_USER_AGENT']));
	}

?>