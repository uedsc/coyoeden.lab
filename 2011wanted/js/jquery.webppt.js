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
			$layout:$d
		};
		this.init();
	};
	p.model.prototype = {
		init:function(){
			this.isAnimating=false;
			this.initView();
			this.bindEvts();
		},
		initView:function(){
			var me=this;
			this.View.$frames=this.View.$layout.find(this.opts.css_frame);
			this.View.$navs=$(this.opts.css_frame_nav).children();
			this.View.$current=this.View.$frames.eq(0);

			//entry nav
			this.View.$frames.each(function(i,o){

				o = $(o);

				var $entrys=o.find("."+me.opts.cl_entry),
					entryHtml="";

				if($entrys.length>0){
					o.data("entrys",$entrys);
					entryHtml = '<div class="'+me.opts.cl_entry_nav+'">';
					$entrys.each(function(){
						entryHtml+='<a href="#"></a>';
					});
					entryHtml +='</div>';

					o.append(entryHtml).find('.'+me.opts.cl_entry_nav+' a')
						.click(function(e){
							var $this=$(this);
							if($this.hasClass("on")){
								me.hideEntry($this.removeClass("on").index(),o);
							}else{
								me.showEntry($this.addClass("on").index(),o);
							}
							return false;
						});
				}

			});

		},
		showEntry:function(idx,$frame){
			$frame.data("entrys").eq(idx).fadeIn();
		},
		hideEntry:function(idx,$frame){
			$frame.data("entrys").eq(idx).fadeOut();
		},
		bindEvts:function(){
			var me=this;
			$(document).keydown(function(e) {

				if( me.isAnimating ){
					return;
				}

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

			this.View.$navs.click(function(e){
				var idx0=me.currentIdx(),
					$me=$(this),
					idx1=$me.index();

				if( (idx1==idx0) || (me.isAnimating) ){
					return false;
				}
				if(idx1<idx0){
					me.animateTo(me.View.$frames.eq(idx1),true);
				}else{
					me.animateTo(me.View.$frames.eq(idx1),false);
				}

				me.activeNav(idx1);
				return false;
			});
		},
		activeNav:function(idx){
			this.View.$navs.removeClass("on").eq(idx).addClass("on");
			$('body').removeClass().addClass("frame-view-"+idx);
		},
		currentIdx:function(){
			return this.View.$current.index();
		},
		animateTo:function($t,isBack){
			var me=this,
				css_in='slide in'+(isBack?' reverse':''),
				css_out='slide out'+(isBack?' reverse':'');

			this.isAnimating=true;

			if( me.opts.onPreNav ){
				me.opts.onPreNav.call(this);
			}

			$t.addClass(this.opts.cl_active+' '+css_in)
				.animationComplete(function(e){
					$t.removeClass(css_in);
				});
			this.View.$current.addClass(css_out)
				.animationComplete(function(e){
					me.isAnimating=false;
					me.View.$current.removeClass(me.opts.cl_active+' '+css_out);
					me.View.$current=$t;
					me.activeNav(me.currentIdx());
				});
		},
		toPrev:function(){
			var $t = this.View.$current.prev();
			if ($t.length == 0)
			{
				return;
			}

			this.animateTo($t,true);
		},
		toNext:function(){
			var $t = this.View.$current.next(),
				me=this;
			if ($t.length == 0 || (!$t.hasClass('wdg-frame')))
			{
				return;
			}
			this.animateTo($t,false);
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
		css_frame_nav:'.wdg-frame-nav',
		cl_entry:'wdg-entry',
		cl_entry_nav:'wdg-entry-nav',
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
