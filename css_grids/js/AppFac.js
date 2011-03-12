/**
 * @author Levin
 * @desc 模块工厂
 */
/*
Javascript Module Pattern 模板v1.0
Author:Levin Van
Last Modified On 2010.05.25
此模板用于js客户端开发,发布时别忘压缩js以便去掉模板中的备注
*/
var AppFac = (function($) {
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
	pub.IsMail=function(val){
		return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(val)
	};
	/*/public area*/
    return pub;
}) (jQuery); 