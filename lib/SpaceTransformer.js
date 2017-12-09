// API v3.0.0
var SpaceTransform = require('./SpaceTransform')
var SpacePlane = require('./SpacePlane')
var nudged = require('nudged')
var extend = require('extend')

var SpaceTransformer = function (plane) {
  // Upgrades SpacePlane to SpaceTransformer
  //
  // Parameters
  //   plane
  //     a SpacePlane
  SpacePlane.call(this)

  this.on('removed', function (self, newParent, oldParent) {
    // Ensure that root nodes have strict identity transformation.
    //
    // Dev. notes:
    // Maintain global location.
    // Why? To make it easy to attach to view temporarily.
    // On the other hand, same relative location would be convenient
    // when moving subelements from group to another.
    // Would it be easier to do explicitly:
    //   gt = taa.getGlobalTransform()
    //   taa.setParent(foo)
    //   taa.setGlobalTransform(gt)
    // Yes it would. Therefore, do not maintain global location!

    if (typeof oldParent === 'undefined') { oldParent = null }
    if (typeof newParent === 'undefined') { newParent = null }

    if (newParent === null) {
      // Root nodes cannot move.
      self.resetTransform()
    } else {
      // Assert: removed from null parent?
      if (oldParent === null) {
        throw new Error('Could not be removed from null parent')
      }
    }
  })
}

var p = extend({}, SpacePlane.prototype)
SpaceTransformer.prototype = p

p.resetTransform = function () {
  // Become space. Called e.g. when plane is removed from parent.
  this._T = nudged.Transform.IDENTITY
  this.emit('transformed', this)
}

p.setLocalTransform = function (spaceTransform) {
  // Transform the plane so that it would be equivalent to
  // transform plane from initial position by the SpaceTransform.
  //
  // This method is needed when we whan to restore stored position,
  // maybe after modification.

  // If we are root, cannot set.
  if (this._parent === null) { return }

  this._T = spaceTransform.to(this._parent).T
  this.emit('transformed', this)
}

p.setGlobalTransform = function (spaceTransform) {
  // Set local transform so that the global transform becomes equal to
  // the given SpaceTransform.
  //
  // Dev note:
  //   Given T is coord. transf. from the plane to root (space).
  //   So is this._T.
  //   current_glob_trans = parent_glob_trans * this_T
  //   new_glob_trans = parent_glob_trans * X
  //   <=> X = inv(parent_glob_trans) * new_glob_trans

  // If we are root, cannot set.
  if (this._parent === null) { return }

  var parentGt = this._parent.getGlobalTransform().T
  var newGt = spaceTransform.toSpace().T
  this._T = parentGt.inverse().multiplyBy(newGt)
  this.emit('transformed', this)
}

p.transformBy = function (spaceTransform) {
  // Apply a SpaceTransform to the node.
  // Root nodes cannot be transformed.

  if (this._parent === null) {
    // We are root, cannot set.
    return
  }
  // Convert on parent plane so we can multiply.
  var normST = spaceTransform.to(this._parent)
  this._T = normST.T.multiplyBy(this._T)
  this.emit('transformed', this)
}

p.translate = function (domain, range) {
  // Move plane horizontally and vertically by example.
  //
  // Translate the plane so that after the translation, the domain points
  // would be as close to given range points as possible.
  //
  // Parameters: see SpaceTransform.prototype.translate
  var st = SpaceTransform.estimate(this, 'T', domain, range)
  this.transformBy(st)
}

p.scale = function (pivot, multiplierOrDomain, range) {
  // Parameters: see SpaceTransform.prototype.scale
  var st = new SpaceTransform(this).scale(pivot, multiplierOrDomain, range)
  this.transformBy(st)
}

p.rotate = function (pivot, radiansOrDomain, range) {
  // Parameters: see SpaceTransform.prototype.rotate
  var st = new SpaceTransform(this).rotate(pivot, radiansOrDomain, range)
  this.transformBy(st)
}

p.translateScale = function (domain, range) {
  // Parameters: see SpaceTransform.prototype.translateScale
  var st = SpaceTransform.estimate(this, 'TS', domain, range)
  this.transformBy(st)
}

p.translateRotate = function (domain, range) {
  // Parameters: see SpaceTransform.prototype.translateRotate
  var st = SpaceTransform.estimate(this, 'TR', domain, range)
  this.transformBy(st)
}
p.scaleRotate = function (pivot, domain, range) {
  // Parameters: see SpaceTransform.prototype.scaleRotate
  var st = SpaceTransform.estimate(this, 'SR', domain, range, pivot)
  this.transformBy(st)
}

p.translateScaleRotate = function (domain, range) {
  // Parameters: see SpaceTransform.prototype.translateScaleRotate
  var st = SpaceTransform.estimate(this, 'TSR', domain, range)
  this.transformBy(st)
}

// plane.translateAndScaleToFit, not sure if necessary for now

module.exports = SpaceTransformer
