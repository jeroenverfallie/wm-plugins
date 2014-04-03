ig.module(
    'weltmeister.plugins.level-properties'
)
.requires(
    'weltmeister.weltmeister',
    'weltmeister.plugins.save-extra'
)
.defines(function(){
wm.LevelProperties = ig.Class.extend({
    properties: {},

    background: null,

    init: function() {
        $('.headerFloat').prepend('<input type="button" id="levelPropertiesButton" value="Properties" class="button" style="margin-right: 10px;"/>');
        var div = $('<div id="levelProperties"></div>');
        div.append('<h2>Level Properties</h2>');
        div.append('<input type="button" id="levelPropertiesCloseButton" value="close" class="button"/>');
        
        var inputdiv = $('<dl id="propertyInput"></dl>');
        inputdiv.append('<dt>Key:</dt><dd><input type="text" class="text" id="propertyKey" /></dd>');
        inputdiv.append('<dt>Value:</dt><dd><input type="text" class="text" id="propertyValue" /></dd>');
        div.append(inputdiv);
        div.append($('<div id="propertyDefinitions"></div>'));


        $('body').append(div);
        $('body').append('<div id="bg" class="modalDialogBackground"></div>');

        $('#levelPropertiesButton').bind('click', this.showUI.bind(this));
        $('#levelPropertiesCloseButton').bind('click', this.closeUI);
        
        $('#propertyKey').bind('keydown', function(ev){ 
            if( ev.which == 13 ){ 
                $('#propertyValue').focus(); 
                return false;
            }
            return true;
        });

        $('#propertyValue').bind('keydown', this.setLevelProperty.bind(this));
    },

    clear: function() {
        this.properties = {};
    },

    setLevelProperty: function(ev) {
        if(ev.which != 13) {
            return true;
        }

        var key = $('#propertyKey').val();
        var value = $('#propertyValue').val();
        var floatVal = parseFloat(value);
        if( value == floatVal ) {
            value = floatVal;
        }

        if(value == null || value == '') {
            this.remove(key);
        } else {
            this.set(key, value);
        }


        ig.game.setModified();
        $('#propertyKey').val('');
        $('#propertyValue').val('');
        $('#propertyValue').blur();
        this.refreshUI();

        $('#propertyKey').focus(); 

        return false;
    },

    remove: function(key) {
        if (key in this.properties) {
            delete this.properties[key];
        }
    },

    set: function(key, val) {
        this.properties[key] = val;
    },

    add: function(key, val) {
        this.set(key, val);
    },

    getSaveData: function() {
        return this.properties;
    },

    refreshUI: function() {
        var html = this.loadPropertiesRecursive(this.properties);
        $('#propertyDefinitions').html(html);

        $('.propertyDefinition').bind( 'mouseup', this.selectProperty );
    },

    loadPropertiesRecursive: function( properties, path ) {
        path = path || "";
        var html = "";
        for( var key in properties ) {
            var value = properties[key];
            if( typeof(value) == 'object' ) {
                html += this.loadPropertiesRecursive( value, path + key + "." );
            }
            else {
                html += '<div class="propertyDefinition"><span class="key">'+path+key+'</span>:<span class="value">'+value+'</span></div>';
            }
        }
        
        return html;
    },

    selectProperty: function( ev ) {
        $('#propertyKey').val( $(this).children('.key').text() );
        $('#propertyValue').val( $(this).children('.value').text() );
        $('#propertyValue').select();
    },

    showUI: function(ev) {
        this.refreshUI();
        $('#bg').fadeIn();
        $('#levelProperties').fadeIn();
        return false;
    },

    closeUI: function(ev) {
        $('#bg').fadeOut();
        $('#levelProperties').fadeOut();
        return false;
    }
})

var el = document.createElement('style');
el.innerHTML = '#levelProperties{z-index:1000;display:none;position:absolute;width:50%;height:80%;left:25%;top:10%;background-color:rgba(0,0,0,0.9);border:1px solid #646464;-webkit-box-shadow:0 0 10px rgba(0,0,0,1)}#levelProperties h2{font-size:1.4em;color:#fff;padding-top:10px;padding-left:15px}#levelPropertiesCloseButton{position:absolute;right:5px;top:5px}#levelProperties input[type="text"],textarea{clear:left;display:block;width:98%}#levelProperties textarea{min-height:50px}#propertyDefinitions{margin-top:30px;border-top:5px solid rgba(255,255,255,0.2);overflow:scroll;height:70%}div.propertyDefinition{color:#aaa;padding:10px;border-bottom:1px solid rgba(255,255,255,0.2);cursor:pointer}div.propertyDefinition:hover{background-color:rgba(255,255,255,0.1)}div.propertyDefinition .key{display:block;float:left;padding-right:5px;text-align:left;color:#fff;overflow:hidden}div.propertyDefinition .value{padding:0 0 0 20px;color:#fff}';

document.head.appendChild(el);



wm.Weltmeister.inject({
    levelproperties: null,

    init: function() {
        this.levelproperties = new wm.LevelProperties();
        this.parent();
    },

    loadNew: function() {
        this.levelproperties.clear();
        this.parent();
    },

    loadResponse: function( data ) {
        var jsonMatch = data.match( /\/\*JSON\[\*\/([\s\S]*?)\/\*\]JSON\*\// );
        var newdata = JSON.parse( jsonMatch ? jsonMatch[1] : data );

        this.levelproperties.clear();
        for (var key in newdata.properties) {
            this.levelproperties.add(key, newdata.properties[key]);
        }
        this.parent( data );
    },

    saveExtra: function( data ) {
        data.properties = this.levelproperties.getSaveData();
        this.parent( data );
    }

});

});
