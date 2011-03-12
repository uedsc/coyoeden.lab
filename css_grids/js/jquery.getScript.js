/**
 * $.getScript extension 
 * @param {String} url get url
 * @param {Function} cbkOk success callback
 * @param {bool} cache cache or not
 * @param {Function} cbkError error callback
 * @param {Function} cbkDone complete callback
 */
$.getScript=function(url,opts/*cbkOk,cache,cbkError,cbkDone,type,data*){
	opts=opts||{};
	opts=$.extend({
		cache:true,
		type:"GET"
	},opts||{});
	$.ajax({
		url:url,
		dataType:"script",
		cache:opts.cache,
		success:opts.success,
		error:opts.error,
		complete:opts.complete,
		type:type||'GET',
		data:opts.data
	});
};