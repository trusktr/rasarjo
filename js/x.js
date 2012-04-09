/*
TODO List:
-DONE- Fix external address detection so the correct page opens when a bookmarked URL is visited.
-- Tweak animation so when user visits a bookmarked page the homepage view is not seen.
	-- Add loading animation for such cases.
-STARTED- Add some mechanism so that content isn't clickable/viewable until ready.
-DONE- Add a feature so that words get out of the way of thumbnail images.
-- Replace the standard document.ready and window.load with the custom function versions.
-- seperate executable, functions, and variables into seperate files.
-- Add category and date views
-- Make opened content titles easier to read and nicer looking.
-- Add keyboard navigation.
-?- Store data so it doesn't have to be reloaded each time.
-- Add next and previous links while viewing content to move to new content

FOR FUN:
-- Create custom scroll bars.
-- Add random colors
-- Customize the mouse cursor.
-ALMOST- Add tooltips for each item in home view to show extra, brief details of each item.
	-- Add a flag so we know when to enable the tooltips (after content is ready)
	-- ^^^ Probably use when_interface_ready() for this issue
-- Add sound effects.
-?- Add a music player.
-- Replace the image fade-in effect with something fancier, yet simple and clean.
*/

/*Settings*/
/*
Before setting the options below, do the following in WordPress:
	-- Set the permalink structure to /%post_id%/%postname%/
	-- Set the desired thumbnail width and height in the media settings.
	-- Customize your menu in wordpress.
*/
var base_url		= 'http://50.116.4.56', // without a trailing slash.
	wp_path			= '/wp', // without a trailing slash.
	aThumbnailSize	= [200, 134]; // set this to match the thumbnail size of WordPress' media settings.

/*Only change these if you know what you're doing.*/
	regex_postUrl	= /^\/[0-9]+\/[a-z0-9\-]+\/$/; // This must match the permalink structure (if you'd like to have a different permalink structure).



/*Don't change these unless you're ready to see your site break or your ready to do major
  modifications, this is part of the internal functionality.*/
var wp_url = base_url+wp_path,
	$clicked_item = null,
	interface_ready = false, //ADDED
	menu_ready = false,
	body_ready = false; //END ADDED

function reorganize() {
	$('#grid').masonry({
		columnWidth: /*132*/204,
		itemSelector: '.box'
	});
}

function top_right($target_item, position, top_offset, right_offset) {
	$target_item.css({ 'position':position, 'top':top_offset+'px', 'right':right_offset+'px' });
}

function top_left($target_item, position, top_offset, left_offset) {
	$target_item.css({ 'position':position, 'top':top_offset+'px', 'left':left_offset+'px' });
}

function when_images_loaded($img_container, callback) { //do callback when images in $img_container are loaded. Only works when ALL images in $img_container are newly inserted images.
	var img_length = $img_container.find('img').length,
		img_load_cntr = 0;
		
	if (img_length) { //if the $img_container contains new images.
		$('img').load(function() { //then we avoid the callback until images are loaded
			img_load_cntr++;
			if (img_load_cntr == img_length) {
				callback();
			}
		});
	}
	else { //otherwise just do the main callback action if there's no images in $img_container.
		callback();
	}
}

function open_content(path, type) {
	var $image = null,
		img_w = 0,
		img_h = 0,
		loader_w = $('#loader_div').width(),
		loader_h = $('#loader_div').height();
	
	/* if a .menu_link is already highlighted, unhighlight it just in case */
	$('.menu_link_active').removeClass('menu_link_active');
	
	if (type == 'page')
	{
		$target_item = $('.menu_link[href*="'+(path.value.split('/'))[1]+'"]');
		console.log('open_content(page)'); //###############################################################################
		top_left( $('#loader_div'), 'absolute',
			/*Top*/		$target_item.offset().top + $target_item.height()/2 - loader_h/2,
			/*Left*/	$target_item.offset().left + $target_item.width()/2 - loader_w/2
		);
		$target_item.addClass('menu_link_active');
	}
	
	else if (type == 'post')
	{
		$target_item = $( '#box_' + (path.value.split('/'))[1] );
		console.log('open_content(post:'+(path.value.split('/'))[1] +')'); //###############################################################################
		
//		$image = $target_item.find('.box_thumb');
//		img_w = $image.outerWidth(true);
//		img_h = $image.outerHeight(true);
		
		top_left( $('#loader_div'), 'absolute',
			/*Top*/		$target_item.offset().top + img_h/2 - loader_h/2,
			/*Left*/	$target_item.offset().left + img_w/2 - loader_w/2
		);
	}
	
	$('#loader_div').removeClass('hidden');
	$('#content').load(wp_url+path.value+' .'+type, function() {
		when_images_loaded( $('#content'), function() {
			$('#loader_div').addClass('hidden');
			$('#grid').hide();
			$('#close_button').show();
	//		$('#content').show();
			$('#content').fadeIn();
			if ($('.entry-utility').length){
				$('#content').css( 'top', ''+($('.entry-utility').offset().top+$('.entry-utility').height())+'px' );
			}
			else {
				$('#content').css( 'top', '17px' );
			}
		});
	});
}

function close_content() {
//	$('#content').hide();
//	$('#grid').show();
	$('#content').fadeOut(function() { $('#grid').show();} );
	$('#close_button').hide();
	
	/* if a .menu_link is already highlighted, unhighlight it just in case */
	$('.menu_link_active').removeClass('menu_link_active');
}

/*REMOVED*/
// $('a').live('click', function() { // Prevent users from going to other pages before DOM ready
	// return false;
// });
/*END REMOVED*/

/*ADDED*/ //Function for tooltips
function tooltips($target) {
    /* CONFIG */
        var xOffset = 30,
			yOffset = 30,
			tip_content = '';
        // these 2 variable determine popup's distance from the cursor
        // you might want to adjust to get the right result
    /* END CONFIG */
    $($target).live('mouseenter', function(e) {
        tip_content = $(this).attr('title');
        $(this).removeAttr('title');
        $('body').append('<div id="tooltip"><span>'+ tip_content +'</span></div>');
        $('#tooltip')
            .css('top',(e.pageY + xOffset) + 'px')
            .css('left',(e.pageX + yOffset) + 'px')
            .fadeOut(0).delay(1000).fadeIn(0);
    });
    $($target).live('mouseleave', function(e) {
        $(this).attr('title', tip_content);
        $('#tooltip').stop().remove();
    });
    $($target).live('mousemove', function(e) {
        $('#tooltip')
            .css('top',(e.pageY + xOffset) + 'px')
            .css('left',
			(
				e.pageX + yOffset + $('#tooltip').outerWidth() < $(window).width() ?
				e.pageX + yOffset :
				$(window).width() - $('#tooltip').outerWidth()
			) + 'px');
    });
}
/*END ADDED*/

$(document).ready(function() {
	console.log("document ready");
	
	$('#buffer').load(wp_url+'/ #wpSiteName', function() {
		$('#siteName > a').text( $('#wpSiteName').text() );
		$('head title').text( $('#wpSiteName').text() );
		$('#buffer').html('');
	});
	
	$('#buffer').load(wp_url+'/ .wpNavMenu > .menu', function() {
		console.log("Creating the menu...");
		
		/* Remove list items from the ul to put them into the menu */
		$('#header menu').html( $('#buffer > .menu').html() );
		
		/*Give a class to our menu links.*/
		$('#header menu li a').each( function() {
			$(this).addClass('menu_link').attr('desc', 'testing');
		});
		
		menu_ready = true; //ADDED //END ADDED
		console.log('Created the menu.');
//		alert('menu ready');
		
		/*Format:
			<li>
				<a class="menu_link" href="#" ></a>
			</li>
			<li>
				<a class="menu_link" href="#" >Wired</a>
			</li>
			<li>
				<a class="menu_link" href="#" >Link</a>
			</li>
			<li>
				<a class="menu_link" href="#" >Projects</a>
			</li>
			<li>
				<a class="menu_link" href="http://x.iaesr.com/wp/about/" >About</a>
			</li>
			<li>
				<a class="menu_link" href="#" >Hire</a>
			</li>
		*/
		
		$('#buffer').html('');
	});
	
	/* create placeholder to load content into before manipulating*/
	$('#buffer').load(wp_url+'/ #wp_content', function() {
	
		/*Create project items*/
		$('#wp_content .post').each(function() {
			$this = $(this);
			var $url		= $this.find('.entry-title a').attr('href'),
				post_id		= $url.split(wp_path)[1].split('/')[1], //the first number in the part of the url after the wordpress path.
				$title		= $this.find('.entry-title a').text(),
				$img_url	= $this.find('.wp-post-image').attr('src'),
				$img_desc	= $this.find('.wp-post-image').attr('alt'),
				
				$box		= $('<div class="box" id="box_'+post_id+'"></div>'),
				$link		= $('<a class="box_link" title="'/*ADDED*/+$title+/*END ADDED*/'" href="XXX URL XXX"></a>'),
				$desc		= $('<div class="box_desc"></div>'),
				$desc_title	= $('<span class="box_desc_title">XXX TITLE XXX</span>'),
				$thumb		= $('<div class="box_thumb">'),
				$thumb_img	= $('<img class="box_thumb_img" src="XXX IMG URL XXX" />');
				
				console.log($url);//#############################
			
			$('#grid').append($box);
			$box.hide();
			$box.append($link);
			$link.attr('href', $url);
			$link.append($desc);
			$desc.append($desc_title);
			$desc_title.text($title);
			$link.append($thumb);
			$thumb.append($thumb_img);
			$thumb_img.attr('src', $img_url)/*.attr('alt', $img_desc).attr('title', $img_desc) <--REMOVED*/;
			when_images_loaded( $('#box_'+post_id), function() {
				$('#box_'+post_id).fadeIn();
			});
		});
		
		body_ready = true; //ADDED //END ADDED
//		alert('body ready');
		
		/*Format:
			<div class="box">
				<a class="box_link" href="XXX URL XXX">
					<div class="box_desc">
						<span class="box_desc_title">XXX TITLE XXX</span>
					</div>
					<div class="box_thumb">
						<img class="box_thumb_img" src="XXX IMG URL XXX" alt="XXX IMG DESCRIPTION XXX" title="XXX IMG DESCRIPTION XXX" />
					</div>
				</a>
			</div>
		*/
		$('#buffer').html('');
	});
	
	$('<a id="close_button" href="'+base_url+'">X</a>').appendTo('body').hide();
	top_right( $('#close_button'), 'fixed', /*top*/4, /*right*/4 );
	
	/*A fake html mouse pointer.*/
	// $('html').mouseenter(function(){
		// $('#mouse').show();
	// });
	// $('html').mouseleave(function(){
		// $('#mouse').hide();
	// });
	// $('html').mousemove(function(e){
		// $('#mouse').css('left', e.pageX + 3).css('top', e.pageY + 3);
	// });
	
	$('.box_link').live('mouseenter', function() {
		$(this).find('.box_desc').stop().fadeTo(1000, 0);
	});
	
	$('.box_link').live('mouseleave', function() {
		$(this).find('.box_desc').stop().fadeTo(0, 1);
	});
	
	$('.menu_link, .box_link').live('click', function() {
		$clicked_item = $(this);
		$.address.value($clicked_item.attr('href').replace(wp_url, '')); // extract the path from the url and set it as the new address value.
		return false;
	});
	
	$('#header h1 a, #close_button').live('click', function() {
		$clicked_item = $(this);
		$.address.value('/');
		return false;
	});
	
	$.address.internalChange(function(path){
		if ($clicked_item.is('.box_link')) {
			open_content(path, 'post');
		}
		else if ($clicked_item.is('.menu_link')) {
			open_content(path, 'page');
		}
		else if ($clicked_item.is('#header h1 a, #close_button')) {
			close_content();
		}
	}); //COMBINE THESE THREE BLOCKS INTO ONE FUNCTION!... DONE! (i think)







//			$.address.externalChange(function(path){ //DUP A
//				if ( path.value === '/' ) {
//					close_content();
//					alert('home');
//				}
//				else if ( path.value.match(regex_postUrl) ) {
//					alert('post');
//					open_content(path, 'post');
//				}
//				else { //otherwise other links are pages for now.
//					alert('page');
//					open_content(path, 'page');
//				}
//			}); //END DUP A









			
	$.address.externalChange(function(path){

		function /*helper*/ when_interface_ready(callback) //ADDED
		{
			if (!menu_ready || !body_ready)
			{
				setTimeout(
					function() {
						when_interface_ready(callback);
					},
					100
				);
        		return;
			}
			else
			{
				if (callback) { /*alert(path.value);*/ callback(); }
			}
		}
		
		when_interface_ready( function() { //END ADDED
			
			
			
//			alert('woo!');

			if ( path.value === '/' ) { //DUP A
				close_content();
//				alert('home2');
			}
			else if ( path.value.match(regex_postUrl) ) {
//				alert('post2');
				open_content(path, 'post');
			}
			else { //otherwise other links are pages for now.
//				alert('page2');
				open_content(path, 'page');
			} //END CONT DUP A
				
				
		
		}); //ADDED //END ADDED

	}); //END DUP A
		
		
		
		
		
		
		
});

$(window).load(function() {
//	reorganize();

/*ADDED*/ //CONTINUE ##########################################################################
	setTimeout(function () {
		tooltips( $('.box_link') );
	}, 3000);
/*END ADDED*/
	
	//Code that Expands Box
	// $('.box img').click(function() {
		// var $this = $(this);
		// if ( $('.opened_box').length ) { //if there's a previously opened box, close it.
			// $('.opened_box').width(200).height(134).removeClass('opened_box');
		// }
		// $this.width(/*232*/608).height(/*232*/700).addClass('opened_box'); //open the box
		// reorganize();
	// });
	
});
