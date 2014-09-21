
//Fetch audio collection
var Db = require('./model').collection('audio'),
	config = require('../lib/config/config'),
	id3 = require('id3js'),
	path = require('path'),
	dd = require('../js/lib/dd/src/dd');
	require('../js/lib/dd/src/modules/model');
	
exports.audio = function(_path){
		var self = dd.model({
			title: '',
			album: '',
			artist: '',
			year: '',
			track: '',
			band: '',
			image: {},
			genre: [],
			path: '',
			parentDir: '',
			extension: ''
		});
		
		
		self.save = function(){
			Db.insert(self.out(),function(err,data){
				if(err){
					console.log("Error inserting record! ",err);
				}else{
					console.log("Data inserted was:",data);
				}
				
			});
		}
		
		self.fetchID3 = function(){
			
			id3({ file: self.path, type: id3.OPEN_LOCAL }, function(err, data) {
				if(err){
					console.log("Error reading id3 tags for :",self.path,"Error was:",err);
				}else if( dd.type(data.v2,'object') ){

					if(dd.type(data.v2.title,'string') ){
						self.title = data.v2.title.replace("\u0000",'');
					}else if(dd.type(data.title,'string')){
						self.title = data.title.replace("\u0000",'');
					}else{
						//take from file name minus extension!
						self.title = path.basename(data.path,path.extname(path.basename(data.path)));
					}
					
					if(dd.type(data.v2.album,'string') ){
						self.album = data.v2.album.replace("\u0000",'');
					}else if(dd.type(data.album,'string')){
						self.album = data.album.replace("\u0000",'');
					}else{
						//take from current dir name!
						
					}
					
					if( dd.type(data.v2.artist,'string') ){
						self.artist = data.v2.artist.replace("\u0000",'');
					}else if(dd.type(data.artist,'string')){
						self.artist = data.artist.replace("\u0000",'');
					}else{
						//take from parent dir name!
						
					}			
					
					if( dd.type(data.v2.year,'string') ){
						self.year = data.v2.year.replace("\u0000",'');
					}else if( dd.type(data.v2.year,'string') ){
						self.year = data.year.replace("\u0000",'');
					}
					
					
					if( dd.type(data.v2.band,'string') ){
						self.band = data.v2.band.replace("\u0000",'');
					}else if( dd.type(data.band,'string') ){
						self.band = data.band.replace("\u0000",'');
					}
					
					//do we have to string clean these also?
					if( dd.type(data.v2.genre,'array') ){
						self.genre = data.v2.genre;
					}else if( dd.type(data.genre,'array') ){
						self.genre = data.genre;
					}
								
					if( dd.type(data.v2.image,'object') ){
						self.image = data.v2.image;
					}else if( dd.type(data.image,'object') ){
						self.image = data.image;
					}
					
					self.save();
				}
			});
		}
		
		if(dd.type(_path,'string') ){
			self.path = _path;
			self.parentDir = path.dirname(_path);
			var basename = path.basename(_path);
			self.extension = path.extname(basename);
		}
		
		return self;
	};

//exports.audio = Audio;
