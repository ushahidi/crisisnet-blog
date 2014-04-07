
(function ($) {
    "use strict";

    var vimeoPatterns = 'iframe[src*="vimeo.com"]';

    var youtubePatterns = 'iframe[src*="youtube.com"], iframe[src*="youtube-nocookie.com"], embed[src*="youtube.com"], embed[src*="youtube-nocookie.com"]';

	var videoPatterns = [youtubePatterns, vimeoPatterns].join(', ');

	var soundCloudPatterns = 'iframe[src*="soundcloud.com"]';

    var audioPatterns = [soundCloudPatterns].join(', ');

    function parseVimeoID(url) {
    	var vimeoReg = /.*\.vimeo\.com\/video\/(\d+)/;
		var match = url.match(vimeoReg);
		return match ? match[1] : 0;
    }

    function parseYoutubeID(embedCode) {
    	var youtubeReg = /youtube(-nocookie)?\.com\/(embed|v)\/([\w_-]+)/;
    	var match = embedCode.match(youtubeReg);
		return match ? match[3] : 0;
    }

    function parseSoundCloundID(embedCode) {
    	var soundCloundReg = /soundcloud.com\/tracks\/(\d+)/;
    	var match = embedCode.match(soundCloundReg);
		return match ? match[1] : 0;
    }

	function wrapImageElements() {
		// Append magnific-popup css
		$("head").append('<link rel="stylesheet" type="text/css" href="/assets/css/magnific-popup.css">');

	    // Append magnific-popup script
		$('.post-content').find('img').each(function(){
			var imageEl = $(this);
			imageEl.wrap('<a class="image-link" href="'+imageEl.attr('src')+'"></a>');
			$('.image-link').parents('p').addClass('image-p');
		});

		$.getScript("/assets/js/jquery.magnific-popup.min.js", function(){
		 	$('.image-link').magnificPopup({gallery:{enabled:true}, type:'image'});
	    });
	}

	function wrapVideoElements() {
		$(".post").each(function() {
			$(this).find(videoPatterns).wrap('<div class="post-video"></div>');
		});
	}

	function wrapAudioElements() {
		$(".post").each(function() {
			$(this).find(audioPatterns).wrap('<div class="post-audio"></div>');
		});
	}

	function enableScrollToAuthor() {
		if ( $('.author-link').length ) {
			$('.author-link').click(function(){
			    $('html, body').animate({
			        scrollTop: $( $(this).attr('href') ).offset().top
			    }, 300);
			    return false;
			});	
		}
	}

	function enableScrollToComments() {
		if ( $('.comments-link').length ) {
			$('.comments-link').click(function(){
			    $('html, body').animate({
			        scrollTop: $( $(this).attr('href') ).offset().top
			    }, 300);
			    return false;
			});	
		}
	}

	function enableGridLayoutAndInfiniteScroll() {		
		window.megaAPI = $('.megafolio-container').megafoliopro({
			layoutarray : TAThemeOptions.grid.layout,
			paddingHorizontal : 7,
        	paddingVertical : 7,
        	filterChangeAnimation : TAThemeOptions.grid.animation,
        	filterChangeSpeed: 600,
            filterChangeRotate: 99,
            filterChangeScale: 0.6
		});

		// http://www.infinite-scroll.com/infinite-scroll-jquery-plugin/
		var pattern = jQuery(".pagination span").html().split(" of ");
		$('.megafolio-container').infinitescroll({
		    navSelector: ".pagination",
		    nextSelector: ".pagination a",
		    itemSelector: ".post",
		    debug: false,
		    dataType: 'html',
		    appendCallback: false,
		    animate: true,
		    extraScrollPx: 200,
			maxPage: parseInt(pattern[1]),
		}, function(newElements, data, url){
			
			newElements.addClass('new-post-entry hidden');
			for (var i=0; i<newElements.length; i++) {
				megaAPI.megaappendentry(newElements[i].outerHTML);
			}

			var container = $('.megafolio-container');
			var opt = container.data('opt');
			if (opt.filterChangeSpeed == undefined) opt.filterChangeSpeed = Math.round(Math.random()*500+100);
			if (opt.filterChangeScale == undefined) opt.filterChangeScale = 0.8;
			var outi=0;
			var ini=0;

			setTimeout(function() {
				$('.megafolio-container').find('.new-post-entry').each(function(i){

					var ent = $(this);
					ent.removeClass('hidden');
					ent.removeClass('.new-post-entry');

					var rot = opt.filterChangeRotate;
					if (rot==undefined) rot=30;
					if (rot==99) rot = Math.round(Math.random()*360);

					if (opt.filterChangeAnimation=="fade") {
						ent.transition({'scale':1, 'opacity':0,'rotate':0, duration:0,queue:false});
						ent.transition({'scale':1, 'opacity':1,'rotate':0, duration:1,queue:false});
					} else if (opt.filterChangeAnimation=="scale") {
						ent.transition({'scale':opt.filterChangeScale, 'opacity':0,'rotate':0, duration:0, queue:false});
						ent.transition({'scale':1, 'opacity':1,'rotate':0, duration:1, queue:false});
					} else if (opt.filterChangeAnimation=="rotate") {
						ent.transition({'scale':1, 'opacity':0,'rotate':rot, duration:0,queue:false});
						ent.transition({'scale':1, 'opacity':1,'rotate':0, duration:1,queue:false});
					} else if (opt.filterChangeAnimation=="rotatescale") {
						ent.transition({'scale':opt.filterChangeScale, 'opacity':0,'rotate':rot, duration:0, queue:false});
						ent.transition({'scale':1, 'opacity':0,'rotate':0, duration:1, queue:false});
					} else if (opt.filterChangeAnimation=="pagetop" || opt.filterChangeAnimation=="pagebottom" || opt.filterChangeAnimation=="pagemiddle") {
						ent.find('.mega-entry-innerwrap').transition({'scale':1, 'opacity':0, duration:0, queue:false});
						ent.find('.mega-entry-innerwrap').addClass(opt.filterChangeAnimation);
						ent.find('.mega-entry-innerwrap').transition({'scale':1, 'opacity':1, perspective: '10000px', rotateX: '90deg', duration:1, queue:false});
					}
					renderFeaturedElements(ent);
				});
				megaAPI.megaRefresh();
			},500);
		});
	}

	function renderFeaturedElements(posts) {

		if (!posts) {
			posts = $(".post");
		}

		posts.each(function() {
        	
        	var postEl = $(this);

			if ( postEl.find(".post-content-digest img").length ) {

				var featuredEl = postEl.find(".post-content-digest img").first();
				postEl.find('.mega-entry-innerwrap').css('background-image', 'url('+featuredEl.attr('src')+')');
				postEl.addClass('post-format-image post-with-thumbnail');

			} else if ( postEl.find(".post-content-digest").find(vimeoPatterns).length ) {

				var featuredEl = postEl.find(".post-content-digest").find(videoPatterns).first();
				var vimeoID = parseVimeoID(featuredEl.attr('src'));
				if (vimeoID) {
					$.getJSON('http://www.vimeo.com/api/v2/video/' + vimeoID + '.json?callback=?', function(data) {
						var videoMeta = data[0];
						postEl.find('.mega-entry-innerwrap').css('background-image', 'url('+videoMeta.thumbnail_large+')');
						postEl.addClass('post-format-video post-with-thumbnail');
					});
				}

			} else if ( postEl.find(".post-content-digest").find(youtubePatterns).length ) {

				var featuredEl = postEl.find(".post-content-digest").find(youtubePatterns).first();
				var youtubeID = parseYoutubeID( featuredEl[0].outerHTML );
				if (youtubeID) {
					$.getJSON('http://gdata.youtube.com/feeds/api/videos/' + youtubeID + '?alt=json', function(data) {
						var thumbnail = data['entry']['media$group']['media$thumbnail'][0];
						postEl.find('.mega-entry-innerwrap').css('background-image', 'url('+thumbnail.url+')');
						postEl.addClass('post-format-video post-with-thumbnail');
					});
				}

			} else if ( postEl.find(".post-content-digest").find(soundCloudPatterns).length ) {

				var featuredEl = postEl.find(".post-content-digest").find(soundCloudPatterns).first();
				var soundCloudID = parseSoundCloundID( featuredEl[0].outerHTML );
				if (soundCloudID) {
					var clientID = '849aa50b8899e097dc78de1486686cc1';
					$.getJSON('http://api.soundcloud.com/tracks/'+ soundCloudID +'.json?client_id='+clientID, function(data) {
						var thumbnailURL = data['artwork_url'];
						if (thumbnailURL) {
							var thumbnail_500 = thumbnailURL.replace('-large.jpg', '-t500x500.jpg');
							postEl.find('.mega-entry-innerwrap').css('background-image', 'url('+thumbnail_500+')');
							postEl.addClass('post-format-video post-with-thumbnail');
						} else {
							var avatarURL = data['user']['avatar_url'];
							if (avatarURL) {
								var avatar_500 = avatarURL.replace('-large.jpg', '-t500x500.jpg');
								postEl.find('.mega-entry-innerwrap').css('background-image', 'url('+avatar_500+')');
								postEl.addClass('post-format-video post-with-thumbnail');
							}
						}
					});
				}
			}

        });
	}

	function renderSocialAccounts() {
		$.each( TAThemeOptions.socialAccounts.accounts, function(k, v){
			if ( v ) {
				//Fixed vimeo icon class-name issue.
				var iconClass = k;
				if (k == 'vimeo') { iconClass = k + '-square'; }
				if (k == 'email') { iconClass = 'envelope'; }
				if (k == 'donation') { iconClass = 'coffee'; }
				if ( TAThemeOptions.socialAccounts.colorful ) {
					$('#social-accounts').append('<a class="'+k+'" href="'+v+'"><i class="fa fa-'+iconClass+'"></i></a>');
				} else {
					$('#social-accounts').append('<a href="'+v+'"><i class="fa fa-'+iconClass+'"></i></a>');
				}
			}
		});
	}

	function handleThemeOptions() {

		// Handle disqus
		if ( TAThemeOptions.disqus.enabled ) {
			if ( $('body').hasClass('post-template')) {
				$('#post-comments').show();				
			}
		} else {
			$('.comments-count-bullet').remove();
		}

		// Handle social accounts
		if ( TAThemeOptions.socialAccounts.enabled ) {
			renderSocialAccounts();
		}

	}

	$(document).ready(function(){

		if ( $('body').hasClass('home-template') ) {

			enableGridLayoutAndInfiniteScroll();

			renderFeaturedElements();

		} else if ( $('body').hasClass('archive-template') ) { 

			enableGridLayoutAndInfiniteScroll();

			renderFeaturedElements();

		} else if ( $('body').hasClass('post-template') ) {

			if ( $('.post-content').find('img').length ) {
				wrapImageElements();
			}

			if ( $('.post-content').find(videoPatterns).length ) {
				wrapVideoElements();
			}

			if ( $('.post-content').find(audioPatterns).length ) {
				wrapAudioElements();
			}

			enableScrollToAuthor();

			enableScrollToComments();

		}

		handleThemeOptions();

    });

}(jQuery));
