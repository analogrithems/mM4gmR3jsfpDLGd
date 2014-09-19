

var fs = require('fs'),
	cfg = require('../config/config'),
	mime = require('mime'),
	Ffmpeg = require('fluent-ffmpeg'),
	id3 = require('id3js'),
	os = require('os'),
	dd = require('../../js/lib/dd/dd');//this may freak the fuck out use with caution


exports.index = function(){
	var config = cfg.get();
	
	console.log("Your System is:",os.type(),os.platform(),os.release(),os.arch());

	if( 'darwin' == os.platform() ){
		console.log("Using OSX");
		if( 'x64' == os.arch() ){
			console.log("64Bit Arch");
			Ffmpeg.setFfmpegPath('/Users/analogrithems/Development/nedia/mM4gmR3jsfpDLGd/ffmpeg/ffmpeg-osx64/ffmpeg');
			Ffmpeg.setFfprobePath('/Users/analogrithems/Development/nedia/mM4gmR3jsfpDLGd/ffmpeg/ffmpeg-osx64/ffprobe');
			Ffmpeg.setFlvtoolPath('/usr/bin/flvtool2');			
		}

	}else if( 'windows' == os.platform() ){
		if( 'x64' == os.arch() ){
			console.log("64Bit Arch");
			Ffmpeg.setFfmpegPath('./ffmpeg/ffmpeg-win64/bin/ffmpeg.exe');
			Ffmpeg.setFfprobePath('./ffmpeg/ffmpeg-win64/bin/ffprobe.exe');
			Ffmpeg.setFlvtoolPath('./ffmpeg/ffmpeg-win64/bin/flvtool2.exe');
		}
	}
	
	
	Ffmpeg.getAvailableFormats(function(err, formats) {
	  console.log('Available formats:');
	  console.dir(formats);
	});
	
	Ffmpeg.getAvailableCodecs(function(err, codecs) {
	  console.log('Available codecs:');
	  console.dir(codecs);
	});
	
	Ffmpeg().getAvailableEncoders(function(err, encoders) {
	  console.log('Available encoders:');
	  console.dir(encoders);
	});
	
	Ffmpeg.getAvailableFilters(function(err, filters) {
	  console.log("Available filters:");
	  console.dir(filters);
	});
	
	if(dd.$dd.type(config.media,'object') && dd.$dd.type(config.media.paths,'array')){
		console.log("Search our defined paths");
		config.media.paths.forEach( function(_path){
			console.log("Path:",_path);
			fs.exists(_path,function(exists){
				if(exists){
					recDirIndex(_path);
				}else{
					console.log("Path does not exists! '"+_path+"'");
				}
				//should we add fs watchers to these dirs?
			});
		} );
	}else{
		console.log("No paths defined",dd.$dd.type(config.media));
		process.exit(1);
	}
};


/*
 * Take an actual path and step through it and index all files
 */
var recDirIndex = function(pathDir){
	fs.readdir(pathDir,function(err, files){
		files.forEach(function(file){
			var path = pathDir+'/'+file;
			fs.stat(path, function(err, stats){
				if(err){
					console.log("Error:",err);
				}
				if( stats.isDirectory() ){
					recDirIndex(path);
				}else if( stats.isFile() ){
					indexFile( path );
				}else{
					//who cares, we don't handle devices here
				}
			});
		});
	});
};

var indexFile = function( fl ){

	//what kind of file is this
	var t = mime.lookup(fl);

	
	if( t.match(/audio\/mpeg/g) ){
		console.log("Index this:",fl,"Type is",t);
		
		var f = Ffmpeg(fl).ffprobe( function(err, metadata) {
			if(err){
				console.log("Error:",err);
			}
		    console.dir("Meta Data",metadata);
		});
		console.log("Probe:",f);
		process.exit(1);
	}

}