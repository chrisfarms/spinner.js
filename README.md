spinner.js 
==========

A port of the NETEYE [Activity Indicator](/neteye/jquery-plugins/tree/master/activity-indicator) that renders a translucent activity indicator (spinner)
using SVG or VML for use *without* the JQuery dependency.

Features
--------

* Lightweight script
* No images required
* No external CSS
* Resolution independent
* Alpha transparency
* Highly configurable appearance
* Works in all major browsers
* Uses feature detection
* Degrades gracefully

Supported Browsers
------------------

The plugin has been successfully tested in the following browsers:

* Firefox 2+
* Safari 3.2+

Dependencies
------------

None

Usage
-----

    var spinner = new Spinner(domIdOrElement, {
			segments: 12,
			space: 3,
			length: 7,
			width: 4,
			speed: 1.2,
			align: 'center',
			valign: 'center',
			padding: 4,
			busyClass: 'busy',
			color: '#555'
		});
    spinner.start(); // prepend spinner into target
    spinner.hide(); // remove the spinner from target

You may change the global defaults by modifying the `Spinner.defaults` object.

Links
-----

* Author:  [Chris Farmiloe](http://github.com/chrisfarms)
* License: [MIT](http://chrisfarms.github.com/MIT-LICENSE.txt)
* Demo:    http://chrisfarms.github.com/example.html

