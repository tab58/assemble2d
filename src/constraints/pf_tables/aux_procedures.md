# Auxiliary Procedure

## Analytical Objects

- `axis (object)` -- returns the axis of an object (circle, line, cylinder, helix)
- `centerline (object)` -- creates the centerline of rotation of a curve that's constrained by a rotational DOF (either screw or ellipse+r).
- `circle (point, vector, radius)` -- creates a circle
- `cylinder (line, axis, radius)` -- creates a cylinder
- `helix (point, axis, radius, pitch)` -- returns a helix with a rotational axis on point, with windings of size radius, and a pitch angle between windings.
- `line (point, vector)` -- creates a line
- `plane (point, vector)` -- creates a plane
- `screw (line, point, pitch)` -- creates a screw object
- `sphere (center, radius)` -- creates a sphere

## Generic Procedures

- `a-point(curve-or-surface)` -- returns an "arbitrary" point that lies on the curve or surface
- `copy (object)` -- copies an object
- `cos (quantity-or-pair)` -- returns the cosine element of the pair, or the cosine of the scalar
- `cross-prod (vec-1, vec-2)` -- cross product of vectors
- `dot-prod (vec-1, vec-2)` -- dot product of vectors
- `ellipse+r (ellipse, axis, length)` -- returns an object with an ellipse, a rotational axis, and a length to make an object with a single DOF (combined translation-rotation)
- `intersect (surf-1, surf-2, branch)` -- calculates the intersection of 2 surfaces of either 0D, 1D or 2D, and branch returns which solution is used
- `inverse (transform)` -- gets the inverse transform
- `mag (quantity)` -- if argument is a vector it gets the magnitude, if argument is a scalar it returns the absolute value
- `mod (quantity)` -- the modulo operator
- `normal (plane)` -- returns the normal to the plane
- `pc-check (curve, translation, rotation, branch)` -- for use with screw or ellipse+r.
    + If translation and rotation are non-null, it returns true if they're consistent with the curve.
    + If either translation or rotation is null, it returns a value consistent with curve parameters.
    + If multiple choices are possible, disambiguate with branch.
- `pc-locus (curve, constrained-point, locus-point)` -- return the locus of locus-point, whish is on the same rigid body as constrained-point constrained to lie on the curve.
- `perp-base (P, surface)` -- gets closest point on to surface to P (point)
- `perp-dist (surf-1, surf-2)` -- distance from surf-1 to surf-2.
- `rotate (geom, point, axis, angle)` -- rotate geom around point and axis by angle.
- `sin (quantity-or-pair)` -- returns the sine element of the pair, or the sine of the scalar
- `transform (arg)`
    + if arg is a geom, returns the csys transform
    + if arg is a marker, returns the transform of the geom it's attached to
- `translate (geom, marker)` -- translates the geom by the vector
- `vec-angle (vec-1, vec-2, axis)` -- the angle between vec-1 and vec-2 viewed from the positive axis direction, measured CCW from vec-1 to vec-2. The angle is represented by a (sine, cosine) pair.
- `vec-diff (vec-1, vec-2)` -- vector difference between vec-1 and vec-2
- `vec-scale (vector, scalar)` -- return a vector which is original vector times scalar
- `vec-sum (vec-1, vec-2)` -- vector sum between vec-1 and vec-2
- `x-mul (transform, vector-or-transform)` -- multiply transform times vector or other transform

## Rotation Procedures

### `1r/p-p (geom, center, from-point, to-point, axis, axis-1 = null, axis-2 = null)`

Procedure to rotate `geom` about `axis` and keeps `center` invariant and moves from `from-point` to the globally-fixed `to-point`.

### `1t-1r/p-p/p=lf (geom, point, line, axis, axis-1 = null, axis-2 = null, from-point, to-point, q)`

Procedure to rotate `geom` about `axis` and translate `body` along `line`, thus moving `from-point` to globally-fixed `to-point`. This is for case where `point` is on `geom` and `line` is invariant.

### `1t-1r/p-p/l=lf (geom, point, line, axis, axis-1 = null, axis-2 = null, from-point, to-point, q)`

Procedure to rotate `geom` about `axis` and translate `body` along `line`, thus moving `from-point` to globally-fixed `to-point`. This is for case where `line` is on `geom` and `point` is invariant.

### `1t-1r/p-p` -- connects the other procedures of the same prefix

### `2t-1r/p-p/p=lf (geom, point, plane, axis, axis-1, axis-2, from-point, to-point, q)`

