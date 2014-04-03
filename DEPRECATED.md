This is an old "hacky" way of doing this. Dominic has made a change to *weltmeister.js* to make the installation as seen below redundant.
However, if by any (very weird) means you can't update to the latest repo build, you can still do it this way.

Weltmeister Plugins
====================

Even the greatest tools can use some extensions and improvements.
These are some of my personal plugins/injections to [ImpactJS](http://impactjs.com/)'s editor called [Weltmeister](http://impactjs.com/documentation/weltmeister).


## Installation ##

Because Weltmeister was not built for modding, there are little changes that need to happen in the exisiting files, unfortunatly.

### lib/weltmeister/weltmeister.js ###

At the bottom of the file, comment these 2 lines out.

```javascript
ig.input = new wm.EventedInput();
ig.soundManager = new ig.SoundManager();
ig.ready = true;

//var loader = new wm.Loader( wm.Weltmeister, ig.resources );
//loader.load();

});
```

### weltmeister.html ###

Replace `lib/weltmeister/weltmeister.js` with `lib/weltmeister/plugins/loader.js`

```html
<script src="lib/weltmeister/plugins/loader.js" type="text/javascript" charset="utf-8"></script>
```

### lib/weltmeister/plugins/loader.js ###

This file can be found in the repository too, but for clarification, this is the file where you `require` the plugins you choose to use.

```javascript
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
```

### All Done! ###

Your Weltmeister is now boosted and ready for use!

## Plugins ##

*info about my plugins coming soon*