/*
* @author Levin
* @desc QQ Group index client logic
*/
QLib.M("GroupIndex",(function(){
	var p=pub={};
	//private area
	//ui cache
	p.ui={
		$nav:$("#nav-main"),
		$pop:$("#pop-igroups-ct"),
		$igroup:$("#list-igroup"),
		$slider:$("#slider")
	};
	//left side navigation
	p.initNav=function(){
		var $temp=$nav=null;
		p.ui.$nav.click(function(){
			return false;
		}).find(".has-sub").click(function(e){
			$temp=$(this);
			//already open
			if($temp.hasClass("on")) return;
			//cache
			$nav=$temp.data("nav");
			if(!$nav){
				$nav=$temp.find(".sub-nav");
				$temp.data("nav",$nav);
			};
			//close existing menu
			if(p.ui.$nav.data("curNav")){
				p.ui.$nav.data("curNav").nav.slideUp("fast",function(){
					p.ui.$nav.data("curNav").li.removeClass("on");
				});
			};
			$temp.addClass("on");
			$nav.stop().slideDown("slow",function(){
				p.ui.$nav.data("curNav",{nav:$nav,li:$temp});
			});
		});
		
		//init the open menu
		p.ui.$nav.data("curNav",{
			nav:p.ui.$nav.find(".on .sub-nav"),
			li:p.ui.$nav.find(".on")
		});
	};
	//pop up
	p.initPopup=function(){
		$("#btn-igroups").click(function(){
			if(p.ui.$pop.is(":visible")||p.ui.$pop.is(":animated")) return false;
			p.ui.$pop.slideDown("slow");
			return false;
		});
		return;
		$("#pop-igroups").mouseleave(function(){
			if(p.ui.$pop.is(":visible")||p.ui.$pop.is(":animated")){
				p.ui.$pop.stop().fadeOut();
			};
		});
		
	};
	//slider
	p.initSlider=function(){
		var hmask=146,hslider=116,hmax=0;//height of the slider mask
		if((hmax=p.ui.$igroup.height())<=hmask){
			$("#slide-bar").hide();
			$("#pop-igroups").addClass("noslide");
			return;
		};
		//init slider
		var hslider1=hslider*(hmask/hmax);
		p.ui.$slider.height(hslider1);
		//reset visibility property
		p.ui.$pop.show().css("visibility","");
		//slider
		p.ui.$slider.slider({
			orientation: "vertical",
			range: "min",
			min: hslider1,
			max: hslider,
			value: hslider1,
			slide: function( event, ui ) {
				
			}
		});

	};
	//public area
	pub.init=function(opts){
		p.initNav();
		p.initPopup();
		p.initSlider();
	};
	return pub;
})());