define([
"sq_",
"text!../templates/PaginatorView.html"
], function(sq_, tplStr){
	return Backbone.View.extend({
		tagName: 'nav',
		
		className: 'sq-paginator',
		
		pageCount: 10,
		
		currentPage: 6,
		
		pageSize: 10,
		
		pageButtonCount: 5,
		
		events: {
			"click ul li a": "clickPageButton",
			"click .sq-go-to": "clickGoButton",
			"change .sq-current-page": "validateInput"
		},
		
		_defaultNls: {
			"TOTAL": "Total",
			"GO": "Go"
		},
		
		nls: null,
		
//		template: sq_.template(tplStr, {
//			nlsObject: {}
//		}),
		
		initialize: function(params){
			var t = this;
			if(!params){
				params = [];
			}
			
			t.nls = {};
			$.extend(t.nls, t._defaultNls, params["nls"]);
			t.template = sq_.template(tplStr, {
				nlsObject: t.nls
			});
			
			if(params["pageCount"]){
				t.pageCount = params["pageCount"];
			}
			if(params["currentPage"]){
				t.currentPage = params["currentPage"];
			}
			if(params["pageSize"]){
				t.pageSize = params["pageSize"];
			}
			if(params["pageButtonCount"]){
				t.pageButtonCount = params["pageButtonCount"];
			}
		},
		
//		remove: function(){
//			Backbone.View.prototype.remove.apply(this, arguments);
//		},
		
		render: function(){
			var t = this;
			t.$el.html(this.template({}));
			t.update();
			
			return this;
		},
		
		update: function(){
			var t = this;
			t.$('.sq-page-count').html(t.pageCount);
			t.$('.sq-current-page').val(t.currentPage);
			t.$('.pagination').empty();
			
			t.validateInput();
			
			if(t.pageCount <= t.pageButtonCount){
				for(var i = 1; i <= t.pageCount; i++){
					if(i == t.currentPage){
						t.$('.pagination').append('<li class="active"><a href="javascript:void(0)" data-sq-page-number="' + i + '">' + i + '</a></li>');
					}else{
						t.$('.pagination').append('<li><a href="javascript:void(0)" data-sq-page-number="' + i + '">' + i + '</a></li>');
					}
				}
			}else{
				var leftButtonCount = Math.floor((t.pageButtonCount - 1) / 2);
				var rightButtonCount = t.pageButtonCount - 1 - leftButtonCount;
				
				if(leftButtonCount >= t.currentPage){
					leftButtonCount = t.currentPage - 1;
					rightButtonCount = t.pageButtonCount - 1 - leftButtonCount;
				}else if(rightButtonCount > (t.pageCount - t.currentPage)){
					rightButtonCount = t.pageCount - t.currentPage;
					leftButtonCount = t.pageButtonCount - 1 - rightButtonCount;
				}
				
				if(t.currentPage != 1){
					t.$('.pagination').append('<li><a href="javascript:void(0)" aria-label="Previous" data-sq-page-number="previous">&lt;</a></li>');
				}
				
				var startPage = t.currentPage - leftButtonCount;
				
				for(var i = 0; i < t.pageButtonCount; i ++){
					var tpi = startPage + i;
					if(tpi == t.currentPage){
						t.$('.pagination').append('<li class="active"><a href="javascript:void(0)" data-sq-page-number="' + tpi + '">' + tpi + '</a></li>');
					}else{
						t.$('.pagination').append('<li><a href="javascript:void(0)" data-sq-page-number="' + tpi + '">' + tpi + '</a></li>');
					}
				}
				
				if(t.currentPage != t.pageSize){
					t.$('.pagination').append('<li><a href="javascript:void(0)" aria-label="Next" data-sq-page-number="next">&gt;</a></li>');
				}
			}
		},
		
		clickPageButton: function(e){
			var t = this;
			var ct = e.currentTarget;
			var pageNumber = t.$(ct).attr("data-sq-page-number");
			if(pageNumber == "previous"){
				t.currentPage = t.currentPage * 1 - 1;
			}else if(pageNumber == "next"){
				t.currentPage = t.currentPage * 1 + 1;
			}else{
				t.currentPage = pageNumber;
			}
			
			// Re-render
			t.update();
			t.trigger("onGoToPage", {
				pageNumber: t.currentPage
			});
		},
		
		clickGoButton: function(e){
			var t = this;
			var pageNumber = t.$('.sq-current-page').val();
			t.currentPage = pageNumber;
			
			// Re-render
			t.update();
			t.trigger("onGoToPage", {
				pageNumber: t.currentPage
			});
		},
		
		validateInput: function(e){
			var t = this;
			var valid = false;
			var pageNumber = t.$('.sq-current-page').val() * 1;
			if(_.isNumber(pageNumber) && pageNumber > 0 && pageNumber <= t.pageCount){
				valid = true;
			}else{
				valid = false;
			}
			
			t.$(".sq-current-page").parent().toggleClass("has-error", !valid);
			t.$(".sq-go-to").attr("disabled", !valid);
		}
	});
})
