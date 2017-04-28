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
    + Same as parallel
- Perpendicular (M1, M2)
    + Same as Offset(M1, M2, pi/2)
- Angle (M1, M2, alpha)
    + Same as Offset(M1, M2, alpha)
- Displacement (M1, M2, All reals)
    + Specifies distance from M1 to M2 measured along M2's positive axis

## 2D Joints

- Revolute: Coincident
- Sliding Pin: Inline
- Sliding Fixed: Inline + (Offset/Parallel)