define([], function() {

var siqi = {
	valueTemplateSettings: {
		variable: 'data',
		evaluate: /<%([\s\S]+?)%>/g,
		interpolate: /<%=([\s\S]+?)%>/g,
		escape: /<%-([\s\S]+?)%>/g
	},
	
	nlsTemplateSettings: {
		variable: 'nls',
		evaluate: /\{\{$(.+?)\}\}/g,
		interpolate: /\{\{(.+?)\}\}/g,
		escape: /\{\{-(.+?)\}\}/g
	},
	
	appendUrlParams: function(str, params){
		var href = str;
		var isFirst = false;
		if(href.indexOf("?") < 0){
			href += "?";
			isFirst = true;
		}
		
		for(var i in params){
			if(!isFirst){
				href += "&";
			}else{
				isFrist = false;
			}
			href += i;
			href += "=";
			href += params[i];
		}
		
		return href;
	},
	
	getUrlParams: function(){
		var href = window.location.href;
		var si = href.indexOf("?");
		var queryStr = href.slice(si + 1);
		return this.queryToObject(queryStr);
	},
	
	queryToObject: function(str){
		var params = str.split("&");
		var result = {}, dURI = decodeURIComponent;
		for(var i = 0; i < params.length; i++){
			var param = params[i];
			if(param.length){
				var si = param.indexOf("=");
				if(si < 0){
					name = dURI(param);
					val = "";
				}else{
					name = dURI(param.slice(0, si));
					val  = dURI(param.slice(si + 1));
				}
				if(typeof result[name] == "string"){
					result[name] = [result[name]];
				}
		
				if(_.isArray(result[name])){
					result[name].push(val);
				}else{
					result[name] = val;
				}
			}
		}
		return result;
	},
	
	template: function(tplStr, options){
		//	options:
		//		nlsObject
		//		returnStr
		//		valueTemplateSettings
		//		nlsTemplateSettings
		var targetStr = tplStr;
		if(_.isObject(options)){
			if(options["valueTemplateSettings"]){
				_.extend(this.valueTemplateSettings, options["valueTemplateSettings"]);
			}
			if(options["nlsTemplateSettings"]){
				_.extend(this.nlsTemplateSettings, options["nlsTemplateSettings"]);
			}
			if(_.isObject(options["nlsObject"])){
				targetStr = _.template(targetStr, this.nlsTemplateSettings)(options["nlsObject"]);
			}
			if(options["returnStr"]){
				return targetStr;
			}
		}
		
		return _.template(targetStr, this.valueTemplateSettings);	
	},
	
	isoToDate: function(isoDateStr){
		var ms = Date.parse(isoDateStr);
		var result = new Date();
		result.setTime(ms);
		return result;
	},
	
	passedTimeString: function(date, nowStr, hoursStr, daysStr){
		if(!nowStr){
			nowStr = "less than 1 hour";
		}
		// Just to keep consistent with underscore template. Does not use template method at all.
		if(!hoursStr){
			hoursStr = "<%= hour %> hours ago";
		}
		
		if(!daysStr){
			daysStr = "<%= days %> days ago";
		}
		
		var result = "";
		var currentDate = new Date();
		var passedTime = currentDate.getTime() - date.getTime();
		if(passedTime < 0){
			passedTime = 0;
		}
		passedTime = passedTime / 1000;
		if(passedTime <= 3600){
			result = nowStr;
		}else if(3600 < passedTime && passedTime <= 86400){
			var hours = Math.ceil(passedTime / 3600);
			result = hoursStr.replace("<%= hour %>", hours);
		}else{
			var days = Math.ceil(passedTime / 86400);
			result = daysStr.replace("<%= days %>", days);
		}
		return result;
	}
}
window.siqi = siqi;
	
return siqi;

})