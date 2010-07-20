/*!
 * NETEYE Transform & Transition Plugin
 *
 * Copyright (c) 2010 NETEYE GmbH
 * Licensed under the MIT license
 *
 * Author: Felix Gnass [fgnass at neteye dot de]
 * Version: @{VERSION}
 */
(function($) {
	
	var props = (function() {
	
		var prefixes = ['Webkit', 'Moz', 'O'];
		
		var style = document.createElement('div').style;
			  
		function findProp(name) {
			var result = '';
			if (style[name] !== undefined) {
				return name;
			}
			$.each(prefixes, function() {
				var p = this + name.charAt(0).toUpperCase() + name.substring(1);
				if (style[p] !== undefined) {
					result = p;
					return false;
				}
			});
			return result;
		}
		
		var result = {};
		$.each(['transitionDuration', 'transitionProperty', 'transform', 'transformOrigin'], function() {
			result[this] = findProp(this);
		});
		return result;
		
	})();
	
	var supports3d = (function() {
		var s = document.createElement('div').style;
		try {
			s[props.transform] = 'translate3d(0,0,0)';
			return s[props.transform].length > 0;
		}
		catch (ex) {
			return false;
		}
	})();
		
	$.fn.transition = function(css, opts) {
	
		opts = $.extend({
			delay: 0,
			duration: 0.4
		}, opts);
		
		var property = '';
		for (var n in css) {
			property += n + ',';
		}

		this.each(function() {
			var $this = $(this);
			
			if (!props.transitionProperty) {
				$this.css(css);
				if (opts.onFinish) {
					$.proxy(opts.onFinish, $this)();
				}
				return;
			}
			
			var _duration = $this.css(props.transitionDuration);		
			
			function apply() {
				$this.css(props.transitionProperty, property).css(props.transitionDuration, opts.duration + 's');
				
				$this.css(css);
				if (opts.duration > 0) {
					$this.one('webkitTransitionEnd oTransitionEnd mozTransitionEnd transitionEnd', afterCompletion);
				}
				else {
					setTimeout(afterCompletion, 1);					
				}
			}
			
			function afterCompletion() {
				$this.css(props.transitionDuration, _duration);
					
				if (opts.onFinish) {
					$.proxy(opts.onFinish, $this)();
				}
			}
			
			if (opts.delay > 0) {
				setTimeout(apply, opts.delay);
			}
			else {
				apply();
			}
		});
		return this;
	};
	
	$.fn.transform = function(commands, opts) {
		opts = $.extend({
			origin: '0 0',
		}, opts);
		
		var result = this;
		this.each(function() {
			var $this = $(this);
			
			var t = transform($this, commands);
			if (!commands) {
				result = t.fn;
				return false;
			}
			$this.css(props.transitionDuration, '0s')
				.css(props.transformOrigin, opts.origin)
				.css(props.transform, t.format());
		});
		return result;
	};
	
	$.fn.transformTransition = function(commands, opts) {
		opts = $.extend({
			origin: '0 0',
		}, opts);
		var css = {};
		css[props.transform] = transform(this, commands).format();
		this.css(props.transformOrigin, opts.origin).transition(css, opts);
	};
	
	
	function transform(el, commands) {
		var t = el.data('transform');
		if (!t) {
			t = new Transformation();
			el.data('transform', t);
		}
		if (commands === 'reset') {
			t.reset();
		}
		else {
			t.exec(commands);
		}
		return t;
	}
	
	/**
	 * Class that keeps track of numeric values and converts them into a string representation
	 * that can be used as value for the -webkit-transform property. TransformFunctions are used
	 * internally by the Transformation class.
	 *
	 * // Example:
	 *
	 * var t = new TransformFunction('translate3d({x}px,{y}px,{z}px)', {x:0, y:0, z:0});
	 * t.x = 23;
	 * console.assert(t.format() == 'translate3d(23px,0px,0px)')
	 */
	function TransformFunction(pattern, defaults) {
		function fillIn(pattern, data) {
			return pattern.replace(/\{(\w+)\}/g, function(s, p1) { return data[p1]; });
		}
		this.reset = function() {
			$.extend(this, defaults);
		};
		this.format = function() {
			return fillIn(pattern, this);
		};
		this.reset();
	}
	
	/**
	 * Class that encapsulates the state of multiple TransformFunctions. The state can be modified
	 * using commands and converted into a string representation that can be used as CSS value.
	 * The class is used internally by the transform plugin.
	 */
	function Transformation() {
		var fn = {
			translate: new TransformFunction('translate({x}px,{y}px)', {x:0, y:0}),
			scale: new TransformFunction('scale({s},{s})', {s:1}),
			rotate: new TransformFunction('rotate({deg}deg)', {deg:0})
		};
		
		if (supports3d) {
			// Use 3D transforms for better performance
			fn.translate = new TransformFunction('translate3d({x}px,{y}px,0px)', {x:0, y:0});
			fn.scale = new TransformFunction('scale3d({s},{s},1)', {s: 1});
		}	
		
		var commands = {
			rotate: function(deg) {
				fn.rotate.deg = deg;
			},
			rotateBy: function(deg) {
				fn.rotate.deg += deg;
			},
			scale: function(s) {
				fn.scale.s = s;
			},
			scaleBy: function(s) {
				fn.scale.s *= s;
			},
			translate: function(s) {
				var t = fn.translate;
				if (!s) s = {x: 0, y: 0};
				t.x = (s.x !== undefined) ? parseInt(s.x) : t.x;
				t.y = (s.y !== undefined) ? parseInt(s.y) : t.y;
			},
			translateBy: function(s) {
				var t = fn.translate;
				t.x += parseInt(s.x) || 0;
				t.y += parseInt(s.y) || 0;
			},
			zIndex: function(z) {
				fn.translate.z = parseInt(z);
			}
		};
		this.fn = fn;
		this.exec = function(cmd) {
			for (var n in cmd) {
				commands[n](cmd[n]);
			}
		};
		this.reset = function() {
			$.each(fn, function() {
				this.reset();
			});
		};
		this.format = function() {
			var s = '';
			for (var n in fn) {
				s += fn[n].format() + ' ';
			}
			return s;
		}
	};
	
})(jQuery);