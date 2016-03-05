// API v0.3.0

var Transform = require('./Transform');

var SpacePoint = function (xy, reference) {
  // Example
  //   var p = taaspace.Point([x, y], taa);
  //
  // Parameter
  //   xy
  //     2D array
  //   reference
  //     a SpaceContainer or SpacePoint
  //       an item in space, enabling coord projections.
  this.xy = xy;

  // The SpacePlane's transformation the xy are on.
  // Design note: at first, the references were SpacePlanes and not
  // transformations. But because a SpacePlane can move or be removed,
  // we chose only the transformation to be remembered.
  // Design note: later we found it would be convenient for debugging
  // to know where the point came from, which led to this._origin.
  // After that we found that in toSpace method, we would need reference
  // to space, although we only have implicit reference to its coords.
  // Therefore this._origin was dropped.

  if (reference.hasOwnProperty('getGlobalTransform')) {
    // Is a SpacePlane
    this._T = reference.getGlobalTransform();
  } else {
    // Is a SpacePoint
    this._T = reference._T;
  }
};

var proto = SpacePoint.prototype;


proto.offset = function (dx, dy) {
  // Create a new point nearby.
  //
  // Parameter
  //   dx
  //     Movement towards positive x
  //   dy
  //     ...
  var xy = [this.xy[0] + dx, this.xy[1] + dy];
  return new SpacePoint(xy, this);
};

proto.polarOffset = function (radius, radians) {
  // Create a new point moved by the polar coordinates
  var x = this.xy[0] + radius * Math.cos(radians);
  var y = this.xy[1] + radius * Math.sin(radians);
  return new SpacePoint([x, y], this);
};

proto.equals = function (point) {
  return (this.xy[0] === point.xy[0] &&
          this.xy[1] === point.xy[1] &&
          this._T.equals(point._T));
};

proto.to = function (target) {
  // Create a new SpacePoint at same location but on a
  // different SpacePlane.
  //
  // Parameter
  //   target, a SpacePlane or null.
  //
  // Implementation note (See 2016-03-05-09):
  //
  // First, compute coord. transf. B from the current plane
  // to the space:
  //   x_space = B * x_plane  <=>  x_plane = inv(B) * x_space
  //   B = plane._T
  // Second, let A be coord. transf. from the space to the target plane:
  //   x_target = A * x_space
  //   A = inv(target._T)
  // Therefore combined coord. transf. C from the curr. plane to the target:
  //   x_target = C * x_plane
  //   <=> A * x_space = C * inv(B) * x_space
  //   <=> A = C * inv(B)
  //   <=> C = AB
  //   <=> C = inv(target._T) * plane._T
  //

  if (target === null) {
    // target is the root container (space)
    return this.toSpace();
  }

  // Target's global transformation. This._T is already global.
  var target_gT = target.getGlobalTransform();

  if (target_gT.equals(this._T)) {
    return this;
  } // else
  var C = target_gT.inverse().multiplyBy(this._T);
  var xy_target = C.transform(this.xy);
  return new SpacePoint(xy_target, target);
};

proto.toSpace = function () {
  // Create a new SpacePoint at same location but represented on space coords.
  //
  // Implementation note:
  //   We already have coord. transf. from the current plane to the space:
  //     plane._T
  var xy_space = this._T.transform(this.xy);
  var space_mock = {'_T': Transform.IDENTITY};
  return new SpacePoint(xy_space, space_mock);
};

proto.transform = function (tr) {
  // Create a new point by transformation.
  //
  // Parameter
  //   tr
  //     a Transform
  var xy_hat = tr.transform(this.xy);
  return new SpacePoint(xy_hat, this);
};


module.exports = SpacePoint;
