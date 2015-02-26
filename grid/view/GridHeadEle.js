define([
"sq_",
"text!../templates/GridHeadEle.html"
], function(sq_, tplStr){
	return Backbone.View.extend({
		tagName: 'th',
		
		className: 'sq-grid-head-el',
		
		events: {
			"click .sq-sort-dropdown-button .dropdown-menu li": "sort"
		},
		
		template: sq_.template(tplStr, {
			nlsObject: {}
		}),
		
		model: null,
		
		defaultComparator: null,
		
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
		},
		
		render: function(){
			var t = this;
			this.$el.html(t.template(t.model.toJSON()));
			return this;
		},
		
		sort: function(e){
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
					t.gridView.collection.sort();
				}
			}
		}
	});
})
