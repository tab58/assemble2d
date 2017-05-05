# Coincident

Forces two markers to be spatially coincident.

## DOF Transitions

- (0; 0)(P; -) --------> (0; 0)
    + Checks if M1 and M2 are spatially coincident and on P (point)
- (1; 0)(P, L; -) --------> (0; 0)
    + Move geom from M1 to M2
    + Check if P (point) is on L (line)
- (2; 0)(P; -) --------> (0; 0)
    + Move geom from M1 to M2
- (0.5; 0.5)(P, L; A) --------> (0; 0)
    + Move geom from M1 to M2
    + Check if translation along line is valid and rotate around A (axis) and P (point)
- (0; 1)(P; A) --------> (0; 0)
    + Rotate geom about A (axis) and keep P invariant (rotation center)
    + Moves M2 to globally-fixed M1
- (1; 1)(P, L, lf; A) --------> (0; 0)
    + 
