/**
 * @author Levin
 * @desc 全局JS，存放公用的JS方法，简单模块工厂模式
 */
/*
Javascript Module Pattern 模板v1.0
Author:Levin Van
Last Modified On 2010.05.25
此模板用于js客户端开发,发布时别忘压缩js以便去掉模板中的备注
*/
var QLib = (function($) {
	var p={},pub={};
    /*private area*/
	p._modules={};
	/*
	initVar方法
	作用：用于引用重复使用的dom元素或引用服务器端生成到页面的js变量
	*/
    p.initVar = function(opts) { };
	/*
	onLoaded方法
	作用:统一管理页面加载完毕后的回调方法
	说明:onLoaded方法接管所有页面上注册到$(document).ready(callback)中的callback方法;
		如果你要新增一个$(callback)或$(document).ready,请将你的callback方法放在onLoaded方法体内
	*/
    p.onLoaded = function() { 
		for(var m in p._modules){
			if((m=p._modules[m])&&m.onLoad){
				m.onLoad(m);
			};
		};
	};
	/*
	initEvents方法
	作用:用于为页面dom元素注册各种事件!
	说明:Html页面仅用于表现，任何时候应在标签里面直接注册事件。即避免如<a onclick="xx"/>
	*/
    p.initEvents = function(opts) {
        $(document).ready(p.onLoaded);
    };
	/*/private area*/
    /*public area*/
    /*
	Init方法
	作用:页面js逻辑的唯一入口
	说明：理想状态下每个页面对应一个交互用的js文件，在页面末尾通过下面代码初始化js交互逻辑
	<script type="text/javascript">
	//<![CDATA[
	this$.Init({x:'kk',y:'zz'});
	//]]>
	</script> 
	*/
    pub.Init = function(opts) {
		for(var m in p._modules){
			if((m=p._modules[m])&&m.init){
				m.init(opts);
			};
		};
        p.initVar(opts);
        p.initEvents(opts);
    };
	/**
	 * 往当前页面JS逻辑注册一个功能模块.请在Init方法前调用
	 * @param {Object} key
	 * @param {Object} module 如'{init:function(opts){},onLoad:function(opts){}}'
	 */
	pub.AddModule=function(key,module){
		if (p._modules[key]) {
			alert("Module with key '"+key+"' has beed registered!");
			return;
		};
		p._modules[key]=module;
		//register namespace
		pub[key]=module;
		return pub;
	};
	/**
	 * 获取指定注册的模块
	 * @param {Object} key
	 */
	pub.GetModule=function(key){
		return p._modules[key];
	};
	/**
	 * shortcut method for AddModule & GetModule
	 */
	pub.M=function(key,module){
		if(arguments.length==1){
			return pub.GetModule(key);
		};
		if(arguments.length==2){
			return pub.AddModule(key, module);
		};
		return null;
	};
	/**
	 * include a javascript file on demand
	 * @param {Object} js
	 * @parem {String} id js file id starts with "#"
	 * @param {Object} cbk
	 */
	pub.IncludeJS=function(js,id,cbk){
		var js=$(id);
		js=js.length==0?$('<script type="text/javascript" id="'+id+'" src="'+js+'"></script>').appendTo("head"):js;
		js.attr("href",js);
		js.load(cbk);
	};
	/**
	 * 获取指定日期与当前时间的差值
	 * @param {Object} t the number of milliseconds since midnight of January 1, 1970
	 */
	pub.TimeGap=function(t){
		t=new Date().getTime()-t;
		var retVal={
			type:0					/* 0秒1分2小时3天4月5年 */
		};
		if(t<0) return retVal;
		t=new Date(t);
		var y=t.getFullYear(),
			m=t.getMonth()+1,
			d=t.getDate(),
			h=t.getHours(),
			m1=t.getMinutes(),
			s=t.getSeconds();
			
		if((y-1970)>0){
			retVal.type=5;
			return retVal;
		};
		
		if(m>1){
			retVal.type=4;
			retVal.val=m-1;
			return retVal;
		};
		if(d>1){
			retVal.type=3;
			retVal.val=d-1;
			return retVal;
		};
		if(m1>0){
			retVal.type=1;
			retVal.val=m1;
			return retVal;
		};
		if(s>0){
			retVal.type=0;
			retVal.val=s;
			return retVal;
		};
	};
	/**
	 * simple js template parser		
		E.G,IF:str="<a href=/u/%uid%>%username%</a>"
		data={uid:1,username:'xiami'}
		Then:str = "<a href=/u/1>xiami</a>"
		</summary>
	 * @param {Object} str
	 * @param {Object} data
	 */
	pub.EvalTpl = function(str, data) {
		var result;
		var patt = new RegExp("%([a-zA-z0-9]+)%");
		while ((result = patt.exec(str)) != null) {
			var v = data[result[1]] || '';
			str = str.replace(new RegExp(result[0], "g"), v);
		}
		;
		return str;
	};
	/**
	 * 获取指定长度的随机字符串。注意：仅仅由数字和字母组成
	 * @param {Object} size 随机字符串的长度
	 * @param {Boolean} plusTimeStamp 是否加上当前时间戳
	 */
	pub.RdStr=function(size,plusTimeStamp){
		var size0=8;
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
		size=size||size0;size=size<1?size0:size;size=size>chars.length?size0:size;
		var s = '';
		for (var i=0; i<size; i++) {
			var rnum = Math.floor(Math.random() * chars.length);
			s += chars.substring(rnum,rnum+1);
		};
		if(plusTimeStamp){
			s+=new Date().getTime();
		};
		return s;
	};
	pub.NoPropagation=function(){return false;};
	/**
	 * simple tab
	 * @param {Object} cssWrap
	 * @param {Object} opts {cssTab,cssCT,initIdx,onClick,clOn,outerCT}
	 */
	pub.SlimTab=function(cssWrap,opts){
		opts=$.extend({clOn:"current",cssTab:"li",cssCT:".slimtab-ct",outerCT:false},opts||{});
		(function(wrap,opt){
			var $wrap=$(wrap),
				$tabs=$wrap.find(opt.cssTab),
				$cts=opt.outerCT?$(opt.cssCT):$wrap.find(opt.cssCT),
				udf;
			$wrap.click(QeeTuan.NoPropagation);
			$tabs.click(function(){
				var $i=$(this),idx=$tabs.index($i);
				if(opt.onClick){
					opt.onClick($tabs,$cts,$wrap,$i,idx,opt);
					return;
				};
				$tabs.removeClass(opt.clOn);
				$i.addClass(opt.clOn);
				$cts.hide().eq(idx).show();
			});
			if(udf!=opt.initIdx){
				$tabs.eq(opt.initIdx).click();
			};
		})(cssWrap,opts);
	};
	/**
	 * 清除有害的script字符
	 * @param {Object} text
	 */
	pub.ClearScript = function(text) {
		var scriptWord = "<|>|script|alert|{|}|(|)|#|$|'|\"|:|;|&|*|@|%|^|?";
		var words = scriptWord.split('|');
		for (var i = 0; i < words.length; i++) {
			if (text.indexOf(words[i]) != -1) {
				text = text.replace(words[i], "");
			};
		};
		return text;
	}; //noScript
	/**
	 * 清除字符串中的sql关键字
	 * @param {Object} text
	 */
	pub.ClearSql = function(text) {
		var repWord = "|and|exec|insert|select|delete|update|count|*|chr|mid|master|truncate|char|declare|set|;|from";
		var repWords = repWord.split('|');
		var appIndex;
		for (var i = 0; i < repWords.length; i++) {
			appIndex = text.indexOf(repWords[i]);
			if (appIndex != -1) {
				text = text.replace(repWords[i], "");
			}
		}
		return text;
	};
	pub.charLength = function(str) {
		var nstr = str.replace(/[^x00-xff]/g, "JJ");
		return nstr.length;
	};
	/**
	 * 截断字符串
	 * @param {String} str		 待截断的字符串
	 * @param {int} size		   截断长,注:1个中文字符长度为2
	 * @param {String} tailStr	截断后加在末尾的小尾巴,默认"..."
	 */
	pub.Tail = function(str, size, tailStr) {
		str = $.trim(str);
		var cLen = pub.charLength(str);
		size = size <= 0 ? cLen : size;
		if (size >= cLen) return str;
		while (pub.charLength(str) > size) {
			str = str.substr(0, str.length - 1);
		};
		str += (tailStr || "...");
		return str;
	};	
	/*/public area*/
    return pub;
}) (jQuery); 

/* ============================================== 下面为常用jq插件======================================== */
(function($){
	$.fn.extend({

		//This is where you write your plugin's name
		singleSelect: function(opts) {
			///<summary>single select plugin.说明:点击选中dom元素,同时赋予选中的元素指定的css class,其他的元素移除改css class</summary>
			///<param name="opts">{CssClass:'cur',before:null,after:null}</param>
			var defaultOpts = { CssClass: 'cur', before: null, after: null };
			opts = $.extend(defaultOpts, opts);
			//Iterate over the current set of matched elements
			var items = this;

			return this.each(function() {

				$(this).click(function() {
					//before callback（precondition method）
					if ($.isFunction(opts.before)) {
						if (!opts.before(this)) return false;
					};
					items.filter(":visible").removeClass(opts.CssClass);
					$(this).addClass(opts.CssClass);
					if ($.isFunction(opts.after)) {
						opts.after(this);
					};
				});

			});
		}, //endof singleSelect plugin
		anySelect: function(opts) {
			///<summary>multiple select plugin</summary>
			///<param name="opts">{ CssClass: 'cur', max: 0, after: null, before: null,fail:null}</param>
			var defaultOpts = { CssClass: 'cur', max: 0, after: null, before: null, fail: null };
			opts = $.extend(defaultOpts, opts || {});
			opts.max = opts.max || 0;
			var items = this;
			return this.each(function() {
				var $this = $(this);
				//validate assert

				$this.click(function() {
					if ($.isFunction(opts.before)) {
						if (!opts.before(this)) { opts.fail(this); return false; };
					};
					//toggle effect
					if ($this.hasClass(opts.CssClass)) {
						$this.removeClass(opts.CssClass);
						return true;
					};
					//validate max
					if (opts.max > 0 && items.filter("." + opts.CssClass).size() >= opts.max) {
						if ($.isFunction(opts.fail)) { opts.fail(this); };
						return false;
					};
					$this.addClass(opts.CssClass);
					if ($.isFunction(opts.after)) { opts.after(this); };
				}); //endof click
			}); //endof each
		}, //endof anySelect plugin
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
	/**
	 * $.getScript extension 
	 * @param {String} url get url
	 * @param {Function} cbkOk success callback
	 * @param {bool} cache cache or not
	 * @param {Function} cbkError error callback
	 * @param {Function} cbkDone complete callback
	 */
	$.getScript=function(url,cbkOk,cache,cbkError,cbkDone){
		cache=typeof(cache)=="undefined"?true:cache;
		$.ajax({
			url:url,
			dataType:"script",
			cache:cache,
			success:cbkOk,
			error:cbkError,
			complete:cbkDone
		});
	};
})(jQuery);