/*
	Background Stretcher jQuery Plugin
	© 2009 ajaxBlender.com
	For any questions please visit www.ajaxblender.com 
	or email us at support@ajaxblender.com
	
	Modified by Gecka - http://gecka-apps.com
	
	Version: 1.2.1.gk
*/

;(function($){
	/*  Variables  */
	var container = null;
	var allImgs = '', allLIs = '', containerStr = '';
	
	var element = this;
	var _bgStretcherPause = false;
	var _bgStretcherTm = null;
	
	$.fn.bgStretcher = function(settings){
		settings = $.extend({}, $.fn.bgStretcher.defaults, settings);
		$.fn.bgStretcher.settings = settings;
		
		function _build(){
			if(!settings.images.length){ return; }
			
			_genHtml();
			
			containerStr = '#' + settings.imageContainer;
			container = $(containerStr);
			allImgs = '#' + settings.imageContainer + ' IMG';
			allLIs = '#' + settings.imageContainer + ' LI';
			
			$(allLIs).hide();
			$(allLIs + ':first').show().addClass('bgs-current');
			
			if(!container.length){ return; }
			$(window).resize(_resize);
			
			if(settings.slideShow && $(allImgs).length > 1){
				_bgStretcherTm = setTimeout('jQuery.fn.bgStretcher.slideShow()', settings.nextSlideDelay);
			}
			_resize();
		};
		
		function _resize(){
			var winW = $(window).width();
			var winH = $(window).height();
			var imgW = 0, imgH = 0;

			//	Update container's height
			container.width(winW);
			container.height(winH);
			
			//	Non-proportional resize
			if(!settings.resizeProportionally){
				imgW = winW;
				imgH = winH;
			} else {
				var initW = settings.imageWidth, initH = settings.imageHeight;
				var ratio = initH / initW;
				
				imgW = winW;
				imgH = winW * ratio;
				
				if(imgH < winH){
					imgH = winH;
					imgW = imgH / ratio;
				}
			}
			
			//	Apply new size for images
			if(!settings.resizeAnimate){
				$(allImgs).width(imgW).height(imgH);
			} else {
				$(allImgs).animate({width: imgW, height: imgH}, 'normal');
			}
		};
		
		function _genHtml(){
			var code = '<div id="' + settings.imageContainer + '" class="bgstretcher"><ul>';
			for(i = 0; i < settings.images.length; i++){
				code += '<li><img src="' + settings.images[i] + '" alt="" /></li>';
			}
			code += '</ul></div>';
			$(code).appendTo('body');
		};
		
		/*  Start bgStretcher  */
		_build();
	};
	
	$.fn.bgStretcher.play = function(){
       _bgStretcherPause = false;
       $.fn.bgStretcher._clearTimeout();
       $.fn.bgStretcher.slideShow();
       
	};
	
	$.fn.bgStretcher._clearTimeout = function(){
       if(_bgStretcherTm != null){
           clearTimeout(_bgStretcherTm);
           _bgStretcherTm = null;
       }
	};
	
	$.fn.bgStretcher.pause = function(){
	   _bgStretcherPause = true;
	   $.fn.bgStretcher._clearTimeout();
	};
	
	$.fn.bgStretcher.next = function(){
       $.fn.bgStretcher.slideShow ();
	};
	
	$.fn.bgStretcher.previous = function(){
       $.fn.bgStretcher.slideShow (1);
	};
	
	$.fn.bgStretcher.slideShow = function(rev){
		var current = $(containerStr + ' LI.bgs-current');
		var next = rev != 1 ? current.next() : current.prev();
		
		if(!next.length){
			next = rev != 1 ? $(containerStr + ' LI:first') : $(containerStr + ' LI:last');
		}
		
		$(containerStr + ' LI').removeClass('bgs-current');
		next.addClass('bgs-current');
		
		next.fadeIn( $.fn.bgStretcher.settings.slideShowSpeed );
		current.fadeOut( $.fn.bgStretcher.settings.slideShowSpeed );
		
		if(!_bgStretcherPause){
		  _bgStretcherTm = setTimeout('jQuery.fn.bgStretcher.slideShow()', $.fn.bgStretcher.settings.nextSlideDelay);
		}
	};
	
	/*  Default Settings  */
	$.fn.bgStretcher.defaults = {
		imageContainer:             'bgstretcher',
		resizeProportionally:       true,
		resizeAnimate:              false,
		images:                     [],
		imageWidth:                 1024,
		imageHeight:                768,
		nextSlideDelay:             3000,
		slideShowSpeed:             'normal',
		slideShow:                  true
	};
	$.fn.bgStretcher.settings = {};
})(jQuery);

