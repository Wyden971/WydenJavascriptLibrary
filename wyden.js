	if(typeof Function.prototype.bind == 'undefined'){
		Function.prototype.bind = function(obj){
			var fct = this;
			return function(){
				return fct.apply(obj, arguments);
			};
		};
	
	
  	Function.prototype.callWithTimeout = function(time){
  		var obj = this.__object__;
  		if(typeof obj == 'undefined')
  			obj = window;
  		var args = Array.prototype.slice.call(arguments, 1);
  		var fct = this;
  		return setTimeout(function(){
  			return fct.apply(obj, args);
  		}, time);
  	}
  	
  	Function.prototype.callWithInterval = function(time){
  		var obj = this.__object__;
  		if(typeof obj == 'undefined')
  			obj = window;
  		var args = Array.prototype.slice.call(arguments, 1);
  		var fct = this;
  		return setInterval(function(){
  			return fct.apply(obj, args);
  		}, time);
  	}
  	
  	Function.prototype.applyWithTimeout = function(time, args){
  		var obj = this.__object__;
  		if(typeof obj == 'undefined')
  			obj = window;
  		var fct = this;
  		return setTimeout(function(){
  			return fct.apply(obj, args);
  		}, time);
  	}
  	
  	Function.prototype.applyWithInterval = function(time, args){
  		var obj = this.__object__;
  		if(typeof obj == 'undefined')
  			obj = window;
  		var fct = this;
  		return setInterval(function(){
  			return fct.apply(obj, args);
  		}, time);
  	}
  	
  	Object.prototype.__assignFunctions__ = function(){
  		for(var index in this){
  			var fct = this[index];
  			if(typeof fct != 'function')
  				continue;
  			fct.__object__ = this;
  		}
  		return this;
  	};
  }
	
	function Class(fct, parent){
		if(typeof fct != 'function')
			return fct;
		
		var name = fct.toString().replace('function ', '');
		name = name.substr(0, name.indexOf('('));
		
		var nfct = function(){
			fct.apply(this, arguments);
		
			if(typeof parent == 'function'){
				this.__parent__ = (typeof this.construct == 'function' ? this.construct.apply(this, arguments) : new parent());
				for(var index in this.__parent__){
					var tmp = this.__parent__[index];
					
					if(typeof this[index] == 'undefined'){
						switch((typeof tmp)){
							
							case 'function':
								this[index] = tmp;
							break;
				
							default:
								this.__defineGetter__(index, function(){
									return this.__parent__[index];
								});
								
								this.__defineGetter__(index, function(val){
									return (this.__parent__[index] = val);
								});
						}
					}
				}
			}else{
				throw 'erreur lors de l\'héritage';
			}
			
			
			this.__assignFunctions__();
		};
		
		return (window[name]=nfct);
	};
	
	var toto = function(){
		this.value = 'tata';
		this.test = function(){
			console.log('toto : '+this.value);
		};
		console.log('toto');
	};
	
	Class(function tmp(){
		console.log('tmp');
		this.construct = function(){
			return new toto(10);
		};
		this.value = 'titi';
		this.test = function(){
		console.log(this);
			console.log('tmp : '+this.value);
		}
	}, toto);
	

	var t = new tmp();
	t.value = 'super';
	t.test();
