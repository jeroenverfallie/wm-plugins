// THIS FILE IS DEPRECATED SEE README.

ig.module(
    'weltmeister.plugins.loader'
)
.requires(
    'weltmeister.weltmeister'
    // plugins here
)
.defines(function(){ "use strict";

var loader = new wm.Loader( wm.Weltmeister, ig.resources );
loader.load();

});