ig.module(
    'weltmeister.plugins.floodfill'
).requires(
    'weltmeister.weltmeister'
).defines( function ( ) {
    'use strict';

    var found = false;
    for ( var a in wm.config.binds ) {
        if ( wm.config.binds[ a ] == 'floodfill' ) {
            found = true;
            break;
        }
    }
    if ( !found ) wm.config.binds.F = 'floodfill';


    Array.prototype.contains = function ( obj ) {
        var i = this.length;
        while ( i-- ) {
            if ( this[ i ] === obj ) {
                return true;
            }
        }
        return false;
    }

    Array.prototype.random = function ( ) {
        return this[ Math.floor( ( Math.random( ) * this.length ) ) ];
    }

    wm.FloodFiller = ig.Class.extend( {
        stack: [ ],
        layer: null,
        newTile: null,
        oldTile: null,
        tz: null,
        undo: null,

        init: function ( x, y, layer, oldTile, newTile, undo ) {
            this.layer = layer;
            this.oldTile = oldTile;
            this.newTile = [ ];
            for ( var i = 0; i < newTile.length; i++ ) {
                for ( var n = 0; n < newTile[ i ].length; n++ ) {
                    this.newTile.push( newTile[ i ][ n ] );
                }
            }
            this.tz = this.layer.tilesize;
            this.undo = undo;

            this.floodFill( x, y );
        },

        floodFill: function ( x, y ) {
            this.fillTile( x, y );

            while ( this.stack.length > 0 ) {
                var toFill = this.stack.pop( );
                this.fillTile( toFill[ 0 ], toFill[ 1 ] );
            }
        },

        fillTile: function ( x, y ) {
            if ( !this.alreadyFilled( x, y ) ) this.fill( x, y );

            if ( !this.alreadyFilled( x, y - this.tz ) ) this.stack.push( [ x, y - this.tz ] );
            if ( !this.alreadyFilled( x + this.tz, y ) ) this.stack.push( [ x + this.tz, y ] );
            if ( !this.alreadyFilled( x, y + this.tz ) ) this.stack.push( [ x, y + this.tz ] );
            if ( !this.alreadyFilled( x - this.tz, y ) ) this.stack.push( [ x - this.tz, y ] );
        },

        fill: function ( x, y ) {
            var xx = x / this.tz;
            var yy = y / this.tz;
            if ( xx >= 0 && xx <= this.layer.width && yy >= 0 && yy <= this.layer.height ) {
                var nt = this.newTile.random( );
                this.layer.setTile( x, y, nt );
                this.undo.pushMapDraw( this.layer, x, y, this.oldTile, nt );
            }
        },

        alreadyFilled: function ( x, y ) {
            var xx = x / this.tz;
            var yy = y / this.tz;
            if ( xx >= 0 && xx <= this.layer.width && yy >= 0 && yy <= this.layer.height ) {
                return ( this.newTile.contains( this.layer.getTile( x, y ) ) || this.layer.getTile( x, y ) != this.oldTile );
            } else {
                return -1;
            }
        }
    } );

    wm.Weltmeister.inject( {
        keyup: function ( action ) {
            if ( !this.activeLayer ) {
                return;
            }

            if ( action == 'floodfill' ) {
                if ( !this.activeLayer || !this.activeLayer.scroll ) {
                    return;
                }


                var x = ig.input.mouse.x + this.activeLayer.scroll.x;
                var y = ig.input.mouse.y + this.activeLayer.scroll.y;

                var oldTile = this.activeLayer.getTile( x, y );
                var newTile = this.activeLayer.brush;


                this.undo.beginMapDraw( );
                new wm.FloodFiller( x, y, this.activeLayer, oldTile, newTile, this.undo );
                this.undo.endMapDraw( );
            }

            this.parent( action );
        }
    } )

} );
