require([
	'dd',
	'dd/modules/dom',
	'dd/modules/touch',
	'dd/modules/route'
],function(lib){
	lib.init(function(){
		function make_a_link(elem){
			lib.touch({
				element: elem,
				end: function(){
					var prevs = elem.prevAll('a'),
						nexts = elem.nextAll('a'),
						len = prevs._len > nexts._len?prevs._len:nexts._len,
						totes = len * 100,
						ni;
					for(ni = 0; ni < len; ni++){
						if(ni < prevs._len){
							prevs.get(ni).delay(totes - (ni*100)).css({
								left: '300px',
								opacity: 0
							});
						}
						if(ni < nexts._len){
							nexts.get(ni).delay(totes - (ni*100)).css({
								left: '300px',
								opacity: 0
							});
						}
					}
					setTimeout(function(){
						lib.route.goto(elem[0].getAttribute('data-location') + '/');
						setTimeout(function(){
							elem.css({
								opacity: ''
							});
							prevs.css({
								left: '',
								opacity: '',
							});
							nexts.css({
								left: '',
								opacity: '',
							});
						},200);
					},totes + 200);
				}
			});
		}

		var nav_items = lib.dom('#start-menu a'),
			ni;
		for(ni = 0; ni < nav_items._len; ni++){
			make_a_link(nav_items.get(ni));
		}
	});

	lib.route('',function(){
		lib.dom('#logo').removeClass('hide');
		lib.dom('#start-menu').addClass('show');
		console.log('enter');
	},function(){
		lib.dom('#logo').addClass('hide');
		lib.dom('#start-menu').removeClass('show');
		console.log('leave');
	});
});