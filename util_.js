define([], function() {

var sq = {
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
	},
	
	ipNum: function(startIp, endIp){
		var startIpCmps = startIp.split(".");
		var endIpCmps = endIp.split(".");
		var u1 = Math.pow(256, 3), u2 = Math.pow(256, 2), u3 = 256;
		var ipNum = (endIpCmps[0] -startIpCmps[0]) * u1 + (endIpCmps[1] -startIpCmps[1]) * u2 + (endIpCmps[2] -startIpCmps[2]) * u3 + (endIpCmps[3] -startIpCmps[3]) + 1; 
		return ipNum;
	},
	
	isIpv4: function(ipv4){
		var re = /^\d{1,3}\.\d{1,3}\.\d{1,3}.\d{1,3}$/g;
		var isValid = re.test(ipv4);
		if(isValid){
			var cmps = ipv4.split(".");
			for(var i = 0; i < cmps.length; i++){
				var cmp = cmps[i];
				if( cmp* 1 != cmp){
					isValid = false;
					break;
				}
			}
		}
		return isValid;
	},
	
	isInSameSubnet: function(ipv4Array, netmask){
		var t = this, result = true, subnet = "";
		var netMaskCmps = netmask.split(".");
		result = result && t.isIpv4(netmask);
		if(!result){
			return result;
		}
		
		for(var i = 0; i < ipv4Array.length; i++){
			var ipv4 = ipv4Array[i];
			result = result && t.isIpv4(ipv4);
			if(!result){
				break;
			}
			var ipCmps = ipv4.split(".");
			var tmpSubnet = ""; 
			for(var j = 0; j < ipCmps.length; j++){
				tmpSubnet += ipCmps[j] * 1 & netMaskCmps[j] * 1;
			}
			if(subnet == ""){
				subnet = tmpSubnet;
			}else{
				if(subnet != tmpSubnet){
					result = false;
					break;
				}
			}
		}
		return result;
	}
}
window.sq = sq;
	
return sq;

})