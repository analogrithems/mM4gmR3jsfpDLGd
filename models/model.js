//see https://github.com/sergeyksv/tingodb

var Db = require('tingodb')().Db,
	config = require('../config/config'),
    assert = require('assert'),
    db = new Db(config.get()['db'], {});
    
    
exports.collection = function(collection){
	return db.collection(collection);
}