/**
 * simple tab
 * @param {Object} cssWrap
 * @param {Object} opts {cssTab,cssCT,initIdx,onClick,clOn,outerCT}
 */
AppFac.M("UI.SlimTab",function(cssWrap,opts){
	opts=$.extend({clOn:"current",cssTab:"li",cssCT:".slimtab-ct",outerCT:false},opts||{});
	(function(wrap,opt){
		var $wrap=$(wrap),
			$tabs=$wrap.find(opt.cssTab),
			$cts=opt.outerCT?$(opt.cssCT):$wrap.find(opt.cssCT),
			udf;
		//$wrap.click(QeeTuan.NoPropagation);
		$tabs.click(function(){
			var $i=$(this),idx=$tabs.index($i);
			if(opt.onClick){
				opt.onClick($tabs,$cts,$wrap,$i,idx,opt);
				return false;
			};
			$tabs.removeClass(opt.clOn);
			$i.addClass(opt.clOn);
			$cts.hide().eq(idx).show();
			return false;
		});
		if(udf!=opt.initIdx){
			$tabs.eq(opt.initIdx).click();
		};
	})(cssWrap,opts);
});