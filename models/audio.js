
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
							}
							
						});
					}else{
						//lets update the record in the dm
						Db.update({_id: self.id},self.out());
					}
				}
			});
		};
		
		
		self.fetchID3 = function(){

			if(config.get('probe_threads') > 10){
				console.log("Probe threads full, waiting");
				setTimeout(self.fetchID3(), 500);
			}
			config.set('probe_threads',config.get('probe_threads') + 1);

			Ffmpeg.ffprobe(self.path, function(err, m) {
				config.set('probe_threads',config.get('probe_threads') - 1);

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
								    self.artist = t.artist.trim();
							    }
							    if( dd.type(t.title,'string') ){
								    self.title = t.title.trim();
							    }
							    if( dd.type(t.album,'string') ){
								    self.album = t.album.trim();
							    }
							    if( dd.type(t.genre,'string') ){
								    self.genre.push(t.genre.trim());
							    }else if(dd.type(t.genre,'array') ){
							    	for(var i = 0; i < t.genre.length; i++){
								    	self.genre.push(t.genre[i].trim());	
							    	}
							    }
								if( dd.type(t.TCAT,'string') ){
								    self.genre.push(t.TCAT.trim());
							    }
							    if( dd.type(t.year,'string') ){
								    self.year = t.year.trim();
							    }
							    if( dd.type(t.date,'string') ){
								    self.year = t.date.trim();
							    }
							    if( dd.type(t.track,'string') ){
								    self.track = t.track.trim();
							    }
							    if( dd.type(t.album_artist,'string') ){
								    self.album_artist = t.album_artist.trim();
							    }
							    if( dd.type(t.disc,'string') ){
								    self.disc = t.disc.trim();
							    }
							    if( dd.type(t.disc,'string') ){
								    self.disc = t.disc.trim();
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
				}
			}			
		}

		
		return self;
	};

	exports.audio = audio;
