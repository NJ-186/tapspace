'use strict';

Taaspace.Element = (function () {
  //
  // Abstract prototype for all objects floating in the space.
  // 
  // Methods
  //   create(space, string, options)
  //
  // Animation options
  //   ease (optional, default none)
  //     "in", "out", "in-out", "snap", "none"
  //   duration (optional, default 0)
  //       e.g. "2s"
  //   delay (optional, default 0)
  //       e.g. "2s"
  //
  // Priority
  //   high
  // 
  var exports = {};
  /////////////////
  
  
  
  // Constructor
  
  var Elem = function () {
    this._space = null;
    
    // Location of left top corner in space
    this._x = 0;
    this._y = 0;
    
    // Width in space
    this._w = 0;
    this._h = 0;
    
    // Origo i.e. pivot point
    this._ox = 0;
    this._oy = 0;
  };
  
  exports.create = function () {
      return new Elem();
  };
  
  
  
  // Accessors
  
  Elem.prototype.width = function () {
    // Width of the element in space
    // 
    // Priority
    //   high
    return this._w;
  };
  
  Elem.prototype.height = function () {
    // Height of the element in space
    // 
    // Priority
    //   high
    return this._h;
  };
  
  Elem.prototype.center = function () {
    // Center point of the element in space
    // 
    // Priority
    //   high
  };
  
  Elem.prototype.northwest = function () {
    // Top left corner
    // 
    // Priority
    //   medium
  };
  
  Elem.prototype.northeast = function () {
    // Top right corner
    // 
    // Priority
    //   medium
  };
  
  Elem.prototype.southwest = function () {
    // Bottom left corner
    // 
    // Priority
    //   medium
  };
  
  Elem.prototype.southeast = function () {
    // Bottom right corner
    // 
    // Priority
    //   medium
  };
  
  Elem.prototype.rect = function () {
    // Rectangle of element in space
    // 
    // Return
    //   {x0, y0, x1, y1}
    // 
    // Priority
    //   low
  };
  
  Elem.prototype.inside = function (rect) {
    // Return
    //   true
    //     if obj inside given rectangle
    //   false
    //     otherwise
    // 
    // Priority
    //   low
  };
  
  Elem.prototype.outside = function (rect) {
    // Return
    //   true
    //     if obj outside given rectangle
    //   false
    //     otherwise
    // 
    // Priority
    //   low
  };
  
  
  
  // Mutators
  
  Elem.prototype.origo = function (xy) {
    // Move the fixed point, the pivot point.
    // The point to moveTo and rotate around.
    // Does not move the element in relation to the space origo.
    // 
    // Parameter
    //   xy
    //     Place for new origo in relation to the current origo in space units.
    // 
    // Priority
    //   medium
    return {};
  };
  
  Elem.prototype.size = function (width, height) {
    
    // Parameter
    //   width
    //     in space
    //   height
    //     in space
    //  OR
    //   wh
    //     {width: <width_in_space>, height: <height_in_space>}
    //  OR
    //   <nothing>
    //     Returns the current {width, height} of the element
    // 
    // Return
    //   {width, height} if no parameters
    //  OR
    //   this for chaining
    if (typeof width === 'object') {
      height = width.height;
      width = width.width;
    } else if (typeof width === 'undefined') {
      return {
        width: this._w,
        height: this._h
      };
    }
    
    this._w = width;
    this._h = height;
    
    this._space._scaleDomElement(this);
    
    return this;
  };
  
  Elem.prototype.scale = function (multiplier, options) {
    // Resize the element so that origo does not move.
    // 
    // Parameter
    //   multiplier
    //     Scaling factor. 2 doubles, 0.5 halves.
    //   options
    //     See Animation Options
    // 
    // Return
    //   this
    //     for chaining
    // 
    // Priority
    //   medium
  };
  
  Elem.prototype.rotate = function (angle, options) {
    // Rotate the element around its origo.
    // 
    // Parameter
    //   angle
    //     Degrees e.g. 30, -120.2
    //   options
    //     See Animation Options
    // 
    // Return
    //   this
    //     for chaining
    // 
    // Priority
    //   low
  };
  
  Elem.prototype.moveTo = function (x, y, options) {
    // Move the element so that the origo of the element
    // will be at x y in space.
    // 
    // Parameter
    //   x, y
    //     New place in space
    //   options (optional)
    //     See Animation Options
    // 
    // Return
    //   this
    //     for chaining
    // 
    // Priority
    //   medium
  };
  
  Elem.prototype.moveBy = function (dx, dy, options) {
    // Move the element by distance specified in space coordinates.
    // 
    // Parameter
    //   dx, dy
    //     Distance in space
    //   options (optional)
    //     See Animation Options
    // 
    // Return
    //   this
    //     for chaining
    // 
    // Priority
    //   medium
    
    if (typeof dx === 'object') {
      if (typeof dy === 'object') {
        options = dy;
      }
      dy = dx.y;
      dx = dx.x;
    }
    
    this._x += dx;
    this._y += dy;
    
    this._space._moveDomElement(this, options);
    
    return this;
  };
  
  Elem.prototype.scalable = function (onoff, options) {
    // Make element scalable by pinch gesture.
    // 
    // Parameter
    //   onoff (optional, default true)
    //   options (optional)
    //     Scaling limits
    // 
    // Return
    //   this
    //     for chaining
    // 
    // Priority
    //   low
    return this;
  };
  
  Elem.prototype.rotatable = function (onoff, options) {
    // Priority
    //   low
  };
  
  Elem.prototype.draggable = function (onoff, options) {
    // Make element movable by dragging with pointer or finger.
    // 
    // Parameter
    //   onoff (optional, default true)
    //   options (optional)
    //     Scaling limits
    // 
    // Return
    //   this
    //     for chaining
    // 
    // Priority
    //   low
    return this;
  };
  
  Elem.prototype.remove = function () {
    // Remove the element from space.
    //
    // Priority
    //   high
  };
  
  
  
  // Events
  
  Elem.prototype.on = function (type, viewport, callback) {
    // Attach an event to the element
    // 
    // Priority
    //   high
    
    // Shortcut syntax: on('tap', function () { ... });
    // Attach to all viewports.
    if (typeof callback === 'undefined' && typeof viewport === 'function') {
      callback = viewport;
      this._space._listenDomElements(this, type, callback);
      return;
    } // else
    
    // Attach only to one viewport.
    viewport._listenDomElement(this, type, callback);
  };
  
  Elem.prototype.off = function () {
    // Detach an event from the element
    // 
    // Priority
    //   medium
  };
  
  
  
  // Somewhat abstract pseudo-private mutators
  
  Elem.prototype._domAppend = function () {
    throw "Abstract function. Must be implemented by the instance.";
  };
  
  Elem.prototype._domMove = function (domElem, fromSpace, options) {
    // Move the element on screen.
    // 
    // Can be reimplemented in the child prototype.
    // 
    // Element knows its position in space and uses viewports fromSpace
    // function to find out position on screen.
    
    var xy = fromSpace(this._x, this._y);
    
    domElem.css({
      left: xy.x + 'px',
      top: xy.y + 'px'
    });
  };
  
  Elem.prototype._domScale = function (domElem, fromSpace, scale, options) {
    // Can be reimplemented in the child prototype.
    
    var nw = fromSpace(this._x, this._y);
    var se = fromSpace(this._x + this._w, this._y + this._h);
    
    domElem.css({
      left: nw.x + 'px',
      top: nw.y + 'px',
      width: (se.x - nw.x) + 'px',
      height: (se.y - nw.y) + 'px'
    });
  };
  
  Elem.prototype._domRotate = function () {
    throw "Abstract function. Must be implemented by the instance.";
  };
  
  Elem.prototype._domRemove = function (domElem, options) {
    // Remove the DOMElement from DOM
    // 
    // Can be overridden in the child prototype.
    // 
    // Parameter
    //   options
    //     ease?
    //     duration?
    //     delay?
    domElem.remove();
  };
  
  Elem.prototype._domListen = function (domElem, eventType, callback) {
    // Attach a function to a Hammer event on the element.
    Hammer(domElem[0]).on(eventType, callback);
  };
  
  
  
  ///////////////
  return exports;
}());