# Assemble2D
A 2D geometric constraint solver.

## Usage

### List of Constraints:
- Coincident
- Concentric
- Fixed
- Tangent
- Angle
- Parallel
- Perpendicular
- Distance
- Equal Length
- Horizontal
- Vertical
- Length
- Radius
- Horizontal Distance
- Vertical Distance
- Midpoint

## Theory of Operation

The constraints are expressed as mathematical "energy" functions of the parameters of various geometric entities. Each constraint encodes a relationship between a few of these parameters and returns an "energy" value:

$$ f_(x_1, x_2, ... , x_m) = E $$

The sum of all the "local" constraint functions determines the "global" energy in a given system:

$$ \mathbf{x} = [x_1, x_2, ... , x_n] $$
$$ F(\mathbf{x}) = f_1(\mathbf{x}) + f_2(\mathbf{x}) + ... + f_n(\mathbf{x}) $$

Here, $ \mathbf{x} $ is simply a vector of each independent parameter of the geometric entities (e.g. coordinate value, radius, length, distance, etc.). Each $ f_i(\mathbf{x}) $ involves only a select few of the entries in the $ \mathbf{x} $ vector. The gradient can be calculated in a similar manner:

$$ \nabla F(\mathbf{x}) = g(\mathbf{x}) = \nabla f_1(\mathbf{x}) + \nabla f_2(\mathbf{x}) + ... + \nabla f_n(\mathbf{x}) $$

The key idea here is to construct the global energy function in such a way that the minimum occurs at parameter values that would satisfy the constraints specified for the system:

$$ \underset{\mathbf{x}}{\text{min}} \, F(\mathbf{x}) $$

In this implementation, unconstrained optimization (L-BFGS) is used to find the minimum. The energy functions are quadratic and each of their minimums should be zero when the constraints are satisfied. Thus, the global energy of the system should theoretically be zero when the local constraints are satisfied. If the minimum does not occur at zero, then the system can be said to be overconstrained.

Each parameter has a given "index" (or ID) and must be provided with the starting value. The solver then generates a hash table with the "indexes" as keys and the array offset as values when it constructs the global parameter vector (i.e. the $\mathbf{x}$ vector). For each local energy function, the hash table indexes the right values in the global parameter vector to calculate the local energy functions, then adds them all up to get the global energy function value. It does similarly for the energy gradient function values.
