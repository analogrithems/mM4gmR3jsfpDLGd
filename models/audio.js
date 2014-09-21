
//Fetch audio collection
var Db = require('./model').collection('audio'),
	config = require('../lib/config/config'),
	Ffmpeg = require('fluent-ffmpeg'),
	id3 = require('id3js'),
	path = require('path'),
	os = require('os'),
	dd = require('../js/lib/dd/src/dd');
	require('../js/lib/dd/src/modules/model');
	
	var audio = function(data){
		var self = dd.model({
			title: '',
			album: '',
			album_artist: '',
			artist: '',
			year: '',
			track: '',
			band: '',
			image: {},
			genre: [],
			disc: '',
			duration: '',
			path: '',
			parentDir: '',
			extension: ''
		});
		
		self.isCompilation = function(){
			return (self.artist !== self.album_artist);	
		};
		
		self.findOne = function(args,cb){
			Db.findOne(args,function(err, item){
				if(err){
					console.log("Error Searching for record! ",self.path,err);
				}else{
					if(item == null){
						return null;
					}else{
						var d = new audio(item);
						if( typeof cb === 'function' ){
							cb(d);
						}
					}
				}
			});
		};
		
		self.find = function(args,cb){
			Db.find(args,function(err, items){
				if(err){
					console.log("Error Searching ! ",args,err);
				}else{
					if(item == null){
						return [];
					}else{
						//convert results to records
						var r = [];
						for(var ne = 0; ne < items.length; ne++){
							r.push(new audio(item));
						}
						if( typeof cb === 'function' ){
							cb(r);
						}
					}
				}
			});
		};
		
		self.save = function(){
			//insert or Update?
			Db.findOne({path: self.path},function(err, item){
				if(err){
					console.log("Error Searching for record! ",self.path,err);
				}else{
					if(item == null){
						//lets insert the record
						Db.insert(self.out(),function(err,d){
							if(err){
								console.log("Error inserting record! ",err);
							}else{
								self.id = d._id;
								console.log("Data inserted was:",d);
							}
							
						});
					}else{
						//lets update the record in the dm
						console.log("Record Exists already, Update:",item,"\n\n");
					}
				}
			});
		}
		
		self.fetchID3 = function(){

			Ffmpeg.ffprobe(self.path, function(err, m) {
				if(err){
					console.log("Error Probbing file! ",self.path,err);
				}else{
				    if( dd.type(m,'object') ){
					    if( dd.type(m.format,'object') ){
						    if( dd.type(m.format.duration,'string') ){
						    	self.duration = m.format.duration;
						    }					    
						    if( dd.type(m.format.tags,'object') ){
						    	var t = m.format.tags;
							    if( dd.type(t.artist,'string') ){
								    self.artist = t.artist;
							    }
							    if( dd.type(t.title,'string') ){
								    self.title = t.title;
							    }
							    if( dd.type(t.album,'string') ){
								    self.album = t.album;
							    }
							    if( dd.type(t.genre,'string') ){
								    self.genre.push(t.genre);
							    }else if(dd.type(t.genre,'array') ){
							    	for(var i = 0; i < t.genre.length; i++){
								    	self.genre.push(t.genre[i]);	
							    	}
							    }
								if( dd.type(t.TCAT,'string') ){
								    self.genre.push(t.TCAT);
							    }
							    if( dd.type(t.year,'string') ){
								    self.year = t.year;
							    }
							    if( dd.type(t.date,'string') ){
								    self.year = t.date;
							    }
							    if( dd.type(t.track,'string') ){
								    self.track = t.track;
							    }
							    if( dd.type(t.album_artist,'string') ){
								    self.album_artist = t.album_artist;
							    }
							    if( dd.type(t.disc,'string') ){
								    self.disc = t.disc;
							    }
							    if( dd.type(t.disc,'string') ){
								    self.disc = t.disc;
							    }
						    }
					    }
				    }
				    //save record
				    self.save();
				}
			});

		}
		
		if( data ){
			self.fill(data);
			if( dd.type(data._id,'string') ){
				self.id = data._id;
			}
			if(dd.type(data.path,'string') ){
				if( typeof self.id === 'undefined' ){
					self.path = data.path;
					self.parentDir = path.dirname(data.path);
					var basename = path.basename(data.path);
					self.extension = path.extname(basename);
					
					//fetch tags
					self.fetchID3();
				}
			}			
		}

		
		return self;
	};

	exports.audio = audio;
