require.config({
	packages: [{
		name: 'dd',
		location: 'js/lib/dd/src',
		main: 'dd'
	},{
		name: 'site',
		location: 'js/src',
		main: 'null'
	}]
});

// Load your page js here
// Example: require(['site/pages/login']);
require(['site/pages/main']);
require(['site/pages/library']);
require(['site/pages/movie-grid']);
