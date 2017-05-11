# Markers

## Description

Markers serve as the individual points on the geometries that are tied together with constraints.

## Definition

A marker for Assemble2D consists of a position and a direction:

        *-->

Because a second axis only establishes right- or left-handedness of the coordinate system, this fully establishes the degrees of freedom of the marker in space. Each marker has 2 translational degrees of freedom (TDOF) and 1 rotational degree (RDOF).

The position is defined in terms of a "parent" marker, which serves as the local coordinate system. 

*.position* -- the local marker position, or the vector from the parent origin to the marker.

*.axis* -- the local marker axis, or the orientation vector of the marker. This is given in terms of the parent marker, where the parent axis is the X-axis.

## Marker Functions

- `LCF(M)` - local coordinate frame in which M is defined (3x3 matrix)
- `LMP(M)` - local marker position, defined in local frame (Vec2)
- `LMX(M)` - local marker axis, defined in local frame
- `GMP(M)` - global marker position
    + defined as `LCF(M) * LMP(M)`
- `GMX(M)` - global marker axis
    + defined as `LCF(M) * LMX(M)`