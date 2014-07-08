'use strict';

var getAllPropertyNames = require('property-names');
var ucfirst = require('ucfirst');
var camelCase = require('camel-case');
var extend = require('extend');
var getterOrSetterName = require('getter-or-setter-name');
var debug = require('debug')('active-document');

var activeDocument = module.exports = {

	decorate: function( ctor ) {
		debug('%s.decorate', ctor.name);

		extend(ctor, {
			attributeNames: [],
			addAttribute: addAttribute,

			toJSON: toJSON,
			fromJSON: ctor.fromJSON || fromJSON,
		});

		extend(ctor.prototype, {
			get: getter,
			set: setter,

			toJSON: ctor.prototype.toJSON || protoToJSON,
		});

		getAllPropertyNames(ctor.prototype)
			.forEach(function( name ){
				if (typeof ctor.prototype[name] !== 'function' && name[0] !== '_')
					ctor.addAttribute(name);

				if (getterOrSetterName(name))
					ctor.addAttribute(camelCase(name.substr(3)));
			});
	},

	init: function( attributes ) {
		if (debug.enabled)
			debug('%s.init with attribute keys %o', this.constructor.name, attributes && Object.keys(attributes));

		this.attributes = attributes || {};
	},

};

// ctor methods

var toJSON = function( obj ) {
	return obj.toJSON();
};

var fromJSON = function( json, byReference ) {
	debug('%s.fromJSON', this.name);
	return new this(byReference ? json : extend({}, json));
};

var addAttribute = function( attributeName ) {
	if (!attributeName)
		throw new Error('Cannot add attribute without a name');

	if (~this.attributeNames.indexOf(attributeName))
		return;

	debug('%s.addAttribute: adding %s', this.name, attributeName);

	this.attributeNames.push(attributeName);
	ensureAttributeFunc(this, attributeName);
	addAttributeProp(this, attributeName);
};

// proto methods

var protoToJSON = function() {
	return extend({}, this.attributes);
};

var getter = function( attr ) {
	return this.attributes[attr];
};

var setter = function( attr, value ) {
	return this.attributes[attr] = value;
};

// helpers

var ensureAttributeFunc = function( ctor, attrName ) {
	var AttrName = ucfirst(attrName);

	if (!ctor.prototype['get'+AttrName])
		ctor.prototype['get'+AttrName] = function() { return this.get(attrName); };

	if (!ctor.prototype['set'+AttrName])
		ctor.prototype['set'+AttrName] = function( value ) { return this.set(attrName, value); };
};

var addAttributeProp = function( ctor, attrName ) {
	var AttrName = ucfirst(attrName);
	var AttrName = ucfirst(attrName);
	var getter = ctor.prototype['get'+AttrName];
	var setter = ctor.prototype['set'+AttrName];
	var config = {
		writeable: false,
		enumerable: true,
	};

	if (getter)
		config.get = getter;

	if (setter)
		config.set = setter;

	Object.defineProperty(ctor.prototype, attrName, config);
};