'use strict';

var getAllPropertyNames = require('property-names');
var extend = require('extend');
var mutator = require('mutator-name');
var debug = require('debug')('active-document');

var activeDocument = module.exports = {
	decorate: function( ctor ){
		debug('%s.decorate', ctor.name);

		extend(ctor, {
			attributeNames: [],
			addAttribute: addAttribute,

			toJSON: ctor.toJSON || toJSON,
			fromJSON: ctor.fromJSON || fromJSON,
		});

		getAllPropertyNames(ctor.prototype)
			.forEach(function( attr ){
				if (attr[0] !== '_' && (mutator(attr) || typeof ctor.prototype[attr] !== 'function'))
					ctor.addAttribute(mutator.nameFrom(attr) || attr);
			});

		extend(ctor.prototype, {
			toJSON: selfToJSON,
		});
	},

	init: function( attributes ){
		attributesConfig.attributes.value = attributes || {};
		Object.defineProperty(this, 'attributes', attributesConfig.attributes);
	},
};

var attributesConfig = {
	attributes: {
		writable: false,
		enumerable: false,
		configurable: false,
	},
};

function fromJSON( json ){
	debug('%s.fromJSON %j', this.name, json);

	attributesConfig.attributes.value = json;
	return Object.create(this.prototype, attributesConfig);
}

function toJSON( obj ){
	return obj.toJSON();
}

function selfToJSON(){
	return extend(true, {}, this.attributes);
}

function addAttribute( attr ){
	if (!attr)
		throw new Error('Cannot add attribute without a name');

	if (~this.attributeNames.indexOf(attr))
		return;

	debug('%s.addAttribute: adding %s', this.name, attr);

	this.attributeNames.push(attr);

	Object.defineProperty(this.prototype, attr, {
		writeable: false,
		enumerable: true,
		configurable: false,
		get: this.prototype[mutator.getterFrom(attr)] || function(){
			return this.attributes[attr];
		},
		set: this.prototype[mutator.setterFrom(attr)] || function( value ){
			return this.attributes[attr] = value;
		},
	});
}
