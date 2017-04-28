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

*.transform()* -- the local coordinate transform, or the 3x3 rotation matrix that will translate from the local coordinate system (the parent coordinate system) to the global coordinate system (the highest coordinate system in the parent chain).