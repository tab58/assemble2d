# Constraints

## Description

Constraints are main workhorse of the Assemble2D system. Constraints are composed of smaller primitive constraints that combined yield more traditional constraints.

## Primitive Constraints

- Coincident (M1, M2)
    + Makes M1 and M2 spatially coincident
- Inline (M1, M2)
    + M1 lies on line parallel to M2's axis
- Parallel (M1, M2)
    + M1's axis is parallel to M2's axis
- Offset (M1, M2, 0 < alpha <= pi)
    + Angle between M1's axis and M2's axis is alpha
    + _For use only with coincident_

## Compound Constraints
  
- Co-oriented (M1, M2)
    + Parallel(M1, M2) and Offset(M1, M2, 0)
- Perpendicular (M1, M2)
    + Offset(M1, M2, pi/2)

## Displacement Constraint

- Displacement (M1, M2, All reals)
    + Specifies distance from M1 to M2 measured along M2's positive axis

## 2D Joints

- Revolute: Coincident
- Sliding Pin: Inline
- Sliding Fixed: Inline + (Offset/Parallel)

## Geometric Predicates

### Translation Predicates

- `geom-has-2-TDOF(G)`  
    - no translational constraints
- `geom-has-1-TDOF(G, P, L, f)` -- no translational constraints
    - keeps `P` (point) on `L` (line)
    - `f` is either `P` or `L`, whichever is fixed in the geom `G`.
- `geom-has-1/2-TDOF(G, P, obj)`
    + keeps `P` (point) on `obj` (object)
    + `obj` is a 1D curve that's coupled with a rotation (?)
- `geom-has-0-TDOF(G, P)`
    + keeps `G` (geom) at `P` (point)
    + `P` is an expression involving markers
    + `P` denotes the center of rotation

### Rotation Predicates

- `geom-has-1-RDOF(G)`
    + no rotational constraints
- `geom-has-1/2-RDOF(G, A)`
    + `A` (axis) is rotation axis (probably always z-axis)
    + contains angle input to the predicate `geom-has-1/2-TDOF(G, P, obj)`
- `geom-has-0-RDOF(G)`
    + fully rotationally constrained