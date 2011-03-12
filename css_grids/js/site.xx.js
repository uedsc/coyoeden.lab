AppFac.M("Home",(function(){
	var p={}, pub={};
	p.layoutPlay={
		colors:["#01AEF0","#01ACF0"],
		init:function(){
			var me=this;
			$("#btn-show-layout").toggle(function(e){
				$(".w-33").css("border","2px dashed #fff");
				$('[class|="g"]').each(function(i,o){
					o=$(o);
					if(!o.data("bg_bak")){
						o.data("bg_bak",o.css("background"));
						o.data("position_bak",o.css("position"));
						o.data("tip",'<span class="layout-tip">栅格'+o.attr("class")+','+o.width()+'px</span>');
					};
					o.css({
						"background":me.colors[(i%2==0?0:1)],
						"position":"relative"
					}).prepend(o.data("tip"));
				});
			},function(e){
				$(".w-33").css("border","none");
				$('[class|="g"]').each(function(i,o){
					o=$(o);
					o.css("background",o.data("bg_bak")).children(":eq(0)").remove();
					o.css("position",o.data("position_bak"));
				});		
			});
		}
	};

	/* Public area
	------------------------------*/
	pub.init=function(opts){
		p.layoutPlay.init();
	};
	pub.onLoad=function(opts){
		
	};
	return pub;
})());