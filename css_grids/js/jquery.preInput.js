;(function($){
	$.fn.extend({

		//This is where you write your plugin's name
		preInput: function(opts) {
			///<summary>为文本框显示默认值</summary>
			var needEmpty = function(defaultVal, curVal) {
				if ($.trim(curVal) == "" || $.trim(curVal) == defaultVal) {
					return true;
				};
				return false;
			};
			return this.each(function() {
				var defaultVal = opts.val || "";
				$(this).val(defaultVal).data("isdefault",true)
				.focus(function() {
					if (needEmpty(defaultVal, this.value)) { $(this).val(""); };
				})
				.blur(function() {
					var val = $(this).val();
					if (needEmpty(defaultVal, val)) { 
						$(this).val(defaultVal); 
					}else{
						$(this).data("isdefault",false);
					};
					if (opts.afterblur) { opts.afterblur(this); };
				});
			});
		}//endof preInput plugin
	}); //endof $.fn.extend

})(jQuery);