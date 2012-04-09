<?php
	/*TODO list:
	-DONE- seperate variables, functions, and executable into seperate files.
	-STARTED- Make individual styles for each browser where necessary.
	*/

	include('vars.php');
	include('funcs.php'); //CHANGED moved variables and functions into seperate files.
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Muah hah haha</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=2.0, minimum-scale=2.0, maximum-scale=2.0" />
		<meta name="viewport" content="width=device-width; initial-scale=2.0">

		<link rel="stylesheet" href="css/style.css" />

	<!-- ADDED -->
		<!-- Browser-specific style -->
		<?php if ( is_ie() ) { ?>
			<link rel="stylesheet" href="css/ie.css" />
		<?php } ?>
		<?php if ( is_chrome() ) { ?>
			<link rel="stylesheet" href="css/chrome.css" />
		<?php } ?>
	<!-- END ADDED -->

	</head>

<!-- ADDED desc atribute to <body> -->
	<body desc="hello">
	<!-- ADDED -->
		<!--<div id="mouse"></div>-->
	<!-- END ADDED -->
		<div id="wrapper">
			
			<div id="header">
				<h1 id="siteName"><a href="<?php echo $site_url ?>">Muah hah haha</a></h1>
				<menu>
				</menu>
			</div><!-- #header -->
			
			<div id="body">
				<noscript>Javascript must be enabled to view the site.</noscript>

				<div id="content">
				</div>

				<div id="grid">
				</div><!-- #grid -->

			</div><!-- #content -->
			
			<div id="footer"></div>
		</div><!-- #wrapper -->
		
		<div id="loader_div" class="hidden">
			<img id="loader_img" src="http://x.iaesr.com/img/loader5.gif">
		</div>
		
		<div id="buffer" class="hidden">
		</div>

		<script src="http://code.jquery.com/jquery-1.4.4.min.js"></script>
	<!-- ADDED -->
		<script src="js/lib/jquery.simpletip-1.3.1.js"></script>
	<!-- END ADDED -->
		<script src="js/lib/jquery.masonry.js"></script>
		<script src="js/lib/jquery.address-1.4.min.js"></script>
		<script src="js/x.js"></script>

	</body>

</html>
