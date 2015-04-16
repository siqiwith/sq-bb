define([
"sq_",
"text!../templates/GridHeadEle.html"
], function(sq_, tplStr){
	return Backbone.View.extend({
		tagName: 'th',
		
		className: 'sq-grid-head-el',
		
		events: {
			"click .sq-sort-dropdown-button .dropdown-menu li": "indirectSort",
			"click .sq-grid-head-label": "sort"
		},
		
		template: sq_.template(tplStr, {
			nlsObject: {}
		}),
		
		model: null,
		
		defaultComparator: null,
		
		_currentSortType: null,
		
		_indirectSort: false,
		
		initialize: function(params){
			var t = this;
			t.gridView = params["gridView"];
			t.defaultComparator = t.gridView.collection.comparator;
			t.ascComparator = function(a, b){
				var valA = a.get(t.model.get("name"));
				var valB = b.get(t.model.get("name"));
				if(valA == valB){
					return 0;
				}else if(valA > valB){
					return 1;
				}else{
					return -1;
				}
			};
			
			t.descComparator = function(a, b){
				var valA = a.get(t.model.get("name"));
				var valB = b.get(t.model.get("name"));
				if(valA == valB){
					return 0;
				}else if(valA < valB){
					return 1;
				}else{
					return -1;
				}
			};
			
			t._indirectSort = t.gridView.indirectSort;
			t.model.set("indirectSort", t.gridView.indirectSort);
		},
		
		render: function(){
			var t = this;
			this.$el.html(t.template(t.model.toJSON()));
			if(!t._indirectSort){
				t.$(".sq-grid-head-label").css({"cursor": "pointer"});
			}
			return this;
		},
		
		sort: function(e){
			var t = this;
			var ct = e.currentTarget;
			
			var name = t.model.get("name");
			
			if(t._currentSortType == "ascending"){
				t.$(".fa-caret-up").toggleClass("hidden", true);
				t.$(".fa-caret-down").toggleClass("hidden", true);
				if(t.gridView.serverSideSort){
					t.gridView.trigger("onServerSideSort", {
						sortBy: name,
						sortType: "clear"
					});
				}else{
					t.gridView.collection.comparator = t.defaultComparator;
					// TODO: Clear sort is not working when serverSideSort = false 
					t.gridView.collection.sort();
				}
				t._currentSortType = null;
			}else if(t._currentSortType == "descending"){
				t.$(".fa-caret-up").toggleClass("hidden", false);
				t.$(".fa-caret-down").toggleClass("hidden", true);
				if(t.gridView.serverSideSort){
					t.gridView.trigger("onServerSideSort", {
						sortBy: name,
						sortType: "ascending"
					});
				}else{
					t.gridView.collection.comparator = t.ascComparator;
					t.gridView.collection.sort();
				}
				t._currentSortType = "ascending";
			}else{
				t.$(".fa-caret-up").toggleClass("hidden", true);
				t.$(".fa-caret-down").toggleClass("hidden", false);
				if(t.gridView.serverSideSort){
					t.gridView.trigger("onServerSideSort", {
						sortBy: name,
						sortType: "descending"
					});
				}else{
					t.gridView.collection.comparator = t.descComparator;
					t.gridView.collection.sort();
				}
				t._currentSortType = "descending";
			}
		},
		
		indirectSort: function(e){
			var t = this;
			var ct = e.currentTarget;
			
			var name = t.model.get("name");
			
			var pn = $(ct).parent().parent().parent();
			var sortType = t.$(ct).attr("data-sq-sort-type");
			
			t.gridView.resetHeadSort();
			if(sortType == "asc"){
				$(".fa-long-arrow-up", pn).toggleClass("hidden", false);
				$(".fa-long-arrow-down", pn).toggleClass("hidden", true);
				if(t.gridView.serverSideSort){
					t.gridView.trigger("onServerSideSort", {
						sortBy: name,
						sortType: "ascending"
					});
				}else{
					t.gridView.collection.comparator = t.ascComparator;
					t.gridView.collection.sort();
				}
				
			}else if(sortType == "desc"){
				$(".fa-long-arrow-up", pn).toggleClass("hidden", true);
				$(".fa-long-arrow-down", pn).toggleClass("hidden", false);
				if(t.gridView.serverSideSort){
					t.gridView.trigger("onServerSideSort", {
						sortBy: name,
						sortType: "descending"
					});
				}else{
					t.gridView.collection.comparator = t.descComparator;
					t.gridView.collection.sort();
				}

			}else{
				$(".fa-long-arrow-up", pn).toggleClass("hidden", true);
				$(".fa-long-arrow-down", pn).toggleClass("hidden", true);
				if(t.gridView.serverSideSort){
					t.gridView.trigger("onServerSideSort", {
						sortBy: name,
						sortType: "clear"
					});
				}else{
					t.gridView.collection.comparator = t.defaultComparator;
					// TODO: Clear sort is not working when serverSideSort = false 
					t.gridView.collection.sort();
				}
			}
		}
	});
})
