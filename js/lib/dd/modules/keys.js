// $dd.keys
//		Why not add some hotkey bindings? This one is super cool and allows for all
//		sorts of crazy combinations. The basic syntax is:
//			[hold this][press this]
//				and
//			this1 + this2 + this3
//		in any permutation you require
//		caps lock konami code:
//			[shift][up + up + down + down + left + right + left + right + b + a + enter]
;(function(global,factory){
	if(typeof define === 'function' && define.amd) {
		define(['../dd'], function(lib){ return factory(global,lib); });
	} else {
		factory(global,$dd);
	}
})(typeof window !== "undefined" ? window : this, function(global, lib){
	var keyStatus = {},
		keyMap = {},
		add = function(evt){
			var code = evt.which ? evt.which : event.keyCode,
				ni;
			keyStatus[code] = true;

			for(ni in keyMap){
				keyMap[ni].check(code);
			}
		},
		remove = function(evt){
			var code = evt.which ? evt.which : event.keyCode;
			delete keyStatus[code];
		},
		translate = function(str){
			str = str.toLowerCase();
			if(/(ctrl|alt|shift|tab|enter|left|right|up|down)/.test(str)){
				switch(str){
					case 'ctrl': return 17;
					case 'alt': return 18;
					case 'shift': return 16;
					case 'tab': return 9;
					case 'enter': return 13;
					case 'left': return 37;
					case 'right': return 39;
					case 'up': return 38;
					case 'down': return 40;
				}
			}
			return str.toUpperCase().charCodeAt(0);
		},
		sequence = function(str,callback){
			var delay = 500,
				inter = null;

			var self = {
					pointer: 0,
					seq: [],
					callback: callback
				},
				mreg = /(\[[^\]]*\]\[[^\]]*\])/g,
				modifiers = str.match(mreg),
				result = str.replace(mreg,'&').split('+'),
				ni, no, mod, key;

			for(ni = 0; ni < result.length; ni++){
				result[ni] = result[ni].replace(/\s+/g,'');
				if(result[ni] !== '&'){
					self.seq.push({ key: translate(result[ni]) });
					continue;
				}
				mod = modifiers.shift();
				mod = mod.replace(/\]\[/g,'&').replace(/[\[\]]/g,'').split('&');
				key = mod[1].split('+');
				mod = mod[0].split('+');
				for(no = 0; no < mod.length; no++){
					mod[no] = translate(mod[no]);
				}
				for(no = 0; no < key.length; no++){
					self.seq.push({ key: translate(key[no]), state: mod });
				}
			}

			self.check = function(key){
				var curr = self.seq[self.pointer],
					ni, valid, init;
				//normalize numpad
				if(key > 95 && key < 106){
					key -= 48;
				}

				if(curr.state){
					valid = true;
					init = false;
					for(ni = 0; ni < curr.state.length; ni++){
						if(curr.state[ni] === key){
							init = true;
						}
						valid = valid && keyStatus[curr.state[ni]];
					}

					//a modifier must be pressed before being applied
					if(init){
						return self.reset();
					}

					if(!valid || key !== curr.key){
						return self.clear();
					}
				} else if(key !== curr.key){
					return self.clear();
				}

				if(self.pointer < self.seq.length - 1){
					self.pointer++;
					return self.reset();
				}
				if(lib.type(self.callback,'function')){
					self.callback();
				}
				self.clear();
				return true;
			};
			self.reset = function(){
				if(inter){
					clearTimeout(inter);
				}
				inter = setTimeout(self.clear,delay);
				return false;
			};
			self.clear = function(){
				if(!inter){
					return;
				}
				clearTimeout(inter);
				inter = null;
				self.pointer = 0;
				return false;
			};
			return self;
		};

	lib.init(function(){
		if(global.addEventListener){
			global.addEventListener('keydown',add, false);
			global.addEventListener('keyup',remove, false);
		} else {
			global.attachEvent('keydown',add);
			global.attachEvent('keyup',remove);
		}
	});

	lib.mixin({
		keys: function(map){
			for(var ni in map){
				keyMap[ni] = sequence(ni,map[ni]);
			}
		}
	});
});
