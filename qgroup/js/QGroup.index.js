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
		var hslider1=parseInt(hslider*(hmask/hmax));
		p.ui.$slider.height(hslider1);
		//reset visibility property
		p.ui.$pop.hide().css("visibility","");
		//slider
		var gapMask=hmax-hmask,gapSlider=hslider-hslider1,step=2/* scrollSensitivity step */;
		p.ui.$slider.draggable({
			axis: "y",
			containment: "parent",
			scrollSensitivity:step,
			drag: function( event, ui ) {
				p.ui.$igroup.css("top",-(gapMask*(ui.position.top/gapSlider)));
			}
		});
		var scroll=function(s){
			if(p.ui.$igroup.is(":animated")) return;
			p.ui.$igroup.animate({"top":"+="+(s/gapSlider)*gapMask});
			p.ui.$slider.animate({"top":"-="+s});
		};
		$("#btn-slide-up").click(function(){
			if(p.ui.$slider.position().top<=0){
				p.ui.$slider.css("top",0);
				return false;
			};
			scroll(step*2);
			return false;
		});
		$("#btn-slide-dwn").click(function(){
			if(p.ui.$slider.position().top>=gapSlider){
				p.ui.$slider.css("top",gapSlider);
				return false;
			};
			scroll(-step*2);
			return false;
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