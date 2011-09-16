/**
 * PDI 2011 WEBPPT Frame slider
 * @author Levin
 * @version 1.0
 */
;(function($) {
    // Private functions.
    var p = {};
	p.model = function($d,opts){
		this.opts=opts||{};
		this.View={
			layout:$d
		};
		this.init();
	};
	p.model.prototype = {
		init:function(){
			this.View.frames=this.View.layout.find(this.opts.css_frame);
			this.View.current=this.View.frames.eq(0);
			this.bindEvts();
		},
		bindEvts:function(){
			var me=this;
			$(document).keydown(function(e) {
				var key = 0;
				if (e == null) {
					key = event.keyCode;
				} else { // mozilla
					key = e.which;
				}
				switch(key) {
					case 37://left
						me.toPrev();
						break;
					case 38://up
						me.toPrev();
						break;
					case 39://right
						me.toNext();
						break;
					case 40://down
						me.toNext();
						break;
					case 13://enter

						break;
				}
			});
		},
		toPrev:function(){
			var $t = this.View.current.prev(),
				me=this;
			if ($t.length == 0)
			{
				return;
			}
			$t.addClass(this.opts.cl_active+' slide in reverse')
				.animationComplete(function(e){
					$(this).removeClass('slide in reverse');
				});
			this.View.current.addClass('slide out')
				.animationComplete(function(e){
					$(this).removeClass(me.opts.cl_active+' slide out');
					me.View.current=$t;
				});

		},
		toNext:function(){
			var $t = this.View.current.next(),
				me=this;
			if ($t.length == 0 || (!$t.hasClass('wdg-frame')))
			{
				return;
			}
			$t.addClass(this.opts.cl_active+' slide in')
				.animationComplete(function(e){
					$(this).removeClass('slide in');
				});
			this.View.current.addClass('slide out reverse')
				.animationComplete(function(e){
					$(this).removeClass(me.opts.cl_active+' slide out reverse');
					me.View.current=$t;
				});
		}
	};

    //main plugin body
    $.fn.WebPPT = function(opts) {
        // Set the options.
        opts = $.extend({}, $.fn.WebPPT.defaults, opts);
        // Go through the matched elements and return the jQuery object.
        return this.each(function() {
			new p.model($(this),opts);
        });
    };
    // Public defaults.
    $.fn.WebPPT.defaults = {
		css_frame:'.wdg-frame',
		cl_active:'frame-on'
    };

	$.extend( $.support, {
		orientation: "orientation" in window,
		touch: "ontouchend" in document,
		cssTransitions: "WebKitTransitionEvent" in window,
		// TODO: This is a weak test. We may want to beef this up later.
		eventCapture: "addEventListener" in document
	});

	//animation complete callback
	$.fn.animationComplete = function( callback ) {
		if( $.support.cssTransitions ) {
			return $( this ).one( 'webkitAnimationEnd', callback );
		}
		else{
			// defer execution for consistency between webkit/non webkit
			setTimeout( callback, 0 );
			return $( this );
		}
	};

})(jQuery);
