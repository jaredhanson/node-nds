var debug = require('debug')('nds');


function Resolver() {
  this._mechs = [];
}

Resolver.prototype.use = function(fn) {
  this._mechs.push(fn);
};

Resolver.prototype.query = function(id, issuer, cb) {
  var self = this
    , stack = this._mechs
    , idx = 0;
  
  debug('id %s %s', id, issuer);
  
  function next(err, entity) {
    if (err || entity) { return cb(err, entity); }
    
    var layer = stack[idx++];
    if (!layer) { return cb(new Error('Failed to resolve identifier "' + id + '"')); }
    
    try {
      debug('resolve %s', layer.name || 'anonymous');
      var arity = layer.length;
      if (arity == 3) { // async
        layer(id, issuer, next);
      } else {
        // TODO: Ensure that issuer is undefined or equal to id
        layer(id, next);
      }
    } catch (ex) {
      next(ex);
    }
  }
  next();
};


module.exports = Resolver;
