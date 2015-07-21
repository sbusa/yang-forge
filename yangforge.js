// Generated by CoffeeScript 1.9.3
(function() {
  var Forge, Synth,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Synth = require('data-synth');

  Forge = (function(superClass) {
    var assert, fs, path;

    extend(Forge, superClass);

    Forge.set({
      synth: 'forge',
      extensions: {},
      actions: {}
    });

    Forge.extension = function(name, func) {
      return this.set("extensions." + name + ".resolver", func);
    };

    Forge.action = function(name, func) {
      return this.set("actions." + name, func);
    };

    Forge.mixin(require('yang-compiler'));

    assert = require('assert');

    path = require('path');

    fs = require('fs');

    function Forge(input, hooks) {
      var config, err, pkgdir, schemas;
      if (input == null) {
        input = {};
      }
      if (hooks == null) {
        hooks = {};
      }
      if (!Synth["instanceof"](this.constructor)) {
        assert(input instanceof (require('module')), "must pass in 'module' when forging a new module definition, i.e. forge(module)");
        if (module.loaded !== true) {
          module.exports = arguments.callee;
        }
        console.log("INFO: [forge] processing " + input.id + "...");
        try {
          pkgdir = path.dirname(input.filename);
          config = require(path.resolve(pkgdir, './package.json'));
          schemas = (config.schema instanceof Array ? config.schema : [config.schema]).filter(function(e) {
            return (e != null) && !!e;
          }).map(function(schema) {
            return fs.readFileSync(path.resolve(pkgdir, schema), 'utf-8');
          });
        } catch (_error) {
          err = _error;
          console.log("Unable to discover YANG schema for the target module, missing 'schema' in package.json?");
          throw err;
        }
        console.log("INFO: [forge] forging " + config.name + " (" + config.version + ") using schema(s): " + config.schema);
        return Forge.__super__.constructor.call(this, Forge, function() {
          var i, len, schema;
          this.merge(config);
          this.configure(hooks.before);
          for (i = 0, len = schemas.length; i < len; i++) {
            schema = schemas[i];
            this.merge((new this(this.extract('extensions'))).compile(schema));
          }
          return this.configure(hooks.after);
        });
      }
      Forge.__super__.constructor.apply(this, arguments);
    }

    return Forge;

  })(Synth);

  module.exports = Forge(module, {
    before: function() {},
    after: function() {
      return this.action('import', function(input) {
        return this["import"](input);
      });
    }
  });

}).call(this);