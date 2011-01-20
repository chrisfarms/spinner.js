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
* IE8+

Dependencies
------------

None

Usage
-----

    <div id="myElement">
        <!-- an element to hold the spinner graphic -->
    </div>

    <script>

      var options = {
        segments: 12,           // number of 'petals'
        space: 3,               // distance between each petal
        length: 7,              // length of petal
        width: 4,               // stroke size of each line
        speed: 1.2,             // how fast it animates
        color: '#555'           // colour of the spinner
      };
    
      var spinner = new Spinner("myElement", options);
      
      spinner.start();          // append spinner into target
      
      spinner.remove();         // remove the spinner from target
    
    </script>

You may change the global defaults by modifying the `Spinner.defaults` object.

Links
-----

* Author:  [Chris Farmiloe](http://github.com/chrisfarms)
* License: [MIT](http://www.opensource.org/licenses/mit-license.php)
* Demo:    [Spinner Example](http://chrisfarms.github.com/spinner/)

