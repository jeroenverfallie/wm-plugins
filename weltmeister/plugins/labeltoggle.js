ig.module(
	'weltmeister.plugins.labeltoggle'
)
.requires(
	'weltmeister.weltmeister'
)
.defines(function(){ "use strict";

var found = false;
for(var a in wm.config.binds) {
	if(wm.config.binds[a] == "labels") {
		found = true;
		break;
	}
}
if(!found) wm.config.binds.L = "labels"; 

wm.Weltmeister.inject({
	keyup: function( action ) {
		if( !this.activeLayer ) {
			return;
		}

		if( action == 'labels' ) {
            wm.config.labels.draw = !wm.config.labels.draw;
        }

		this.parent( action );
	}
})

});

