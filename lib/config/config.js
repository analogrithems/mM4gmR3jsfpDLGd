var fs = require('fs'),
	cfg;
	
cfg = JSON.parse(fs.readFileSync('./config.json'));

exports.get = function(k){
	if(!k){
		return cfg;
	}
	return cfg[k];
};

exports.set = function( k,v ){
	cfg[k] = v;
}

