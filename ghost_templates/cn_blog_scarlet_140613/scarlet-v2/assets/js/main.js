


jQuery(function($) {

   "use strict"; 

    /* FEATURE MEDIA *************************************/

    
      $(".post").each(function() {
        var thiseliment = $(this);
        $(this).find('.feature-media').appendTo($(this).find('.append-feature-media'));
    });
    // Target your .container, .wrapper, .post, etc.
    $(".post").fitVids();


     var $postsContainer = $('#container');

    
    /* Homepage Masonry *************************************/
    

    if ($postsContainer.length > 0 ) {
        $postsContainer.imagesLoaded(function() {
            $postsContainer.masonry({
                itemSelector: '.post-container',
                isAnimated: true,
                hiddenStyle: { opacity: 0},
                visibleStyle: { opacity: 1},
                transitionDuration: '.5s'
            });

            // Add animate class to the posts container once tha masonry
            // layout is complete. This helps to avoid animation jump in
            // on page load.
            $postsContainer.masonry('on', 'layoutComplete', function() {
                $postsContainer.addClass('animate');
            });
        });
    }

    /* scroll to top ********************************/
    //Check to see if the window is top if not then display button
    $(window).scroll(function(){
        if ($(this).scrollTop() > 200) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });
    
    //Click event to scroll to top
    $('.scrollToTop').click(function(){
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });

    /* ajax loading *******************************/
    var $loadMore = $('.load-more');
    var $loadingImage = $('<i class="fa fa-gear fa-spin"></i> <span>Please wait...</span>');
    var olderPostsUrl = $('.older-posts').attr('href');

    /* show message if end of the post list */
    if (olderPostsUrl === undefined) {
        $loadMore.text('No More Posts');
    }

    $loadMore.on('click', function(e) {
        e.preventDefault();
        // If there are posts to get
        if (olderPostsUrl !== undefined) {
            $loadMore.html($loadingImage);

            $.get(olderPostsUrl, function(result) {
                var $html = $(result);
                var $newContent = $('#container', $html).contents();
                $postsContainer.append($newContent);

                // feature media 
                $(".post").each(function() {
        var thiseliment = $(this);
        $(this).find('.feature-media').appendTo($(this).find('.append-feature-media'));
    });
                $(".post").fitVids();

                $postsContainer.imagesLoaded(function() {
                    $postsContainer.masonry('appended', $newContent);

                    // Get the url for more posts
                    olderPostsUrl = $('.older-posts', $html).attr('href');

                    // Inform the user if there are no more posts
                    if (olderPostsUrl == undefined) {
                        $loadMore.html('No More Posts To Load');
                    } else {
                        $loadMore.html('Load More Posts');
                    }

                    //reset $html variable
                    $html = "";
                });
            });
        }
    });

	    

});
