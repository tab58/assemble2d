import VError from "verror";

import {
  twoProduct,
  twoSum,
  isValidTolerance,
  isOverflow,
  resultFromCalculation,
  inscribedAngleTriangle,
  nrm2
} from "./numeric";

export class Vector3D {
  public static ZERO_3D: Vector3D = new Vector3D(0.0, 0.0, 0.0);
  public static XAXIS_3D: Vector3D = new Vector3D(1.0, 0.0, 0.0);
  public static YAXIS_3D: Vector3D = new Vector3D(0.0, 1.0, 0.0);
  public static ZAXIS_3D: Vector3D = new Vector3D(0.0, 0.0, 1.0);

  private _x: number;
  private _y: number;
  private _z: number;

  constructor(x: number, y: number, z: number) {
    this._x = x;
    this._y = y;
    this._z = z;
  }

  public print(): string {
    return `({${this._x}}, {${this._y}}, {${this._z})`;
  }

  public clone(): this {
    return new Vector3D(this._x, this._y, this._z) as this;
  }

  /// Computes the dot product between two vectors.
  public async dot(w: this): Promise<number> {
    let x1 = this._x;
    let x2 = this._y;
    let x3 = this._z;
    let y1 = w._x;
    let y2 = w._y;
    let y3 = w._z;

    let [p, s] = twoProduct(x1, y1);
    // for i in 2..4 {
    let [h1, r1] = twoProduct(x2, y2);
    let [pp1, qq1] = twoSum(p, h1);
    p = pp1;
    s = s + (qq1 + r1);

    let [h2, r2] = twoProduct(x3, y3);
    let [pp2, qq2] = twoSum(p, h2);
    p = pp2;
    s = s + (qq2 + r2);
    // }

    let d = p + s;
    if (isOverflow(d)) {
      throw new VError("Vector3D.dot(): overflowed result");
    }
    return d;
  }

  /// Returns true if the given vector's components are equal to this vector's components within a tolerance.
  public async isEqualTol(w: this, tol: number): Promise<boolean> {
    if (!isValidTolerance(tol)) {
      throw new VError("Vector3D.is_equal_tol(): invalid tolerance");
    }

    let x = Math.abs(this._x - w._x);
    let y = Math.abs(this._y - w._y);
    let z = Math.abs(this._z - w._z);

    let is_equal = x <= tol && y <= tol && z <= tol;
    return is_equal;
  }

  /// Scales the vector components by the given scalar.
  public async scale(s: number): Promise<this> {
    const newX = this._x * s;
    const newY = this._y * s;
    const newZ = this._z * s;

    if (isOverflow(newX) || isOverflow(newY) || isOverflow(newZ)) {
      throw new VError("Vector3D.scale(): scale resulted in overflow");
    }
    
    return new Vector3D(newX, newY, newZ) as this;
  }

  public add(w: this): this {
    const newX = this._x + w._x;
    const newY = this._y + w._y;
    const newZ = this._z + w._z;
    if (isOverflow(newX) || isOverflow(newY) || isOverflow(newZ)) {
      throw new VError("Vector3D.add(): add resulted in overflow");
    }
    this._x = newX;
    this._y = newY;
    this._z = newZ;
    return this;
  }

  public sub(w: this): this {
    const newX = this._x - w._x;
    const newY = this._y - w._y;
    const newZ = this._z - w._z;
    if (isOverflow(newX) || isOverflow(newY) || isOverflow(newZ)) {
      throw new VError("Vector3D.sub(): sub resulted in overflow");
    }
    this._x = newX;
    this._y = newY;
    this._z = newZ;
    return this;
  }

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public get z(): number {
    return this._z;
  }

  public setX(x: number): void {
    this._x = x;
  }

  public setY(y: number): void {
    this._y = y;
  }

  public setZ(z: number): void {
    this._z = z;
  }

  public set(x: number, y: number, z: number): void {
    this._x = x;
    this._y = y;
    this._z = z;
  }

  public async angleBetweenVectors(w: this): Promise<number> {
    let u, v;
    try {
      u = await this.normalize();
    } catch (e) {
      throw new VError("Vector3D.angle_between_vectors(): error normalizing this vector");
    }
    try {
      v = await w.normalize();
    } catch (e) {
      throw new VError("Vector3D.angle_between_vectors(): error normalizing vector argument");
    }
    
    let x, y;
    try {
      y = await u.clone().sub(v).length();
    } catch (e) {
      throw new VError("Vector3D.angle_between_vectors(): error normalizing vector difference");
    }
    try {
      x = await u.clone().add(v).length();
    } catch (e) {
      throw new VError("Vector3D.angle_between_vectors(): error normalizing vector sum");
    }
    return 2.0 * Math.atan2(y, x);
  }

  /// Gets the components of the vector.
  public getComponents(): [number, number, number] { return [this._x, this._y, this._z]; }

  /// Gets the length of the vector.
  public async length(): Promise<number> {
    let len = nrm2(nrm2(this._x, this._y), this._z);
    return resultFromCalculation(len);
  }

  /// Gets the squared length of the vector.
  public async lengthSquared(): Promise<number> {
    let x = this._x;
    let y = this._y;
    let z = this._z;

    let len = x * x + y * y + z * z;
    return resultFromCalculation(len);
  }

  // Computes the cosine of the angle between the two vectors via the dot product.
  public async dotCosine(w: this): Promise<number> {
    let vv, ww;
    try {
      vv = await this.normalize();
    } catch (e) {
      throw new VError("Vector3D.dot_cosine(): error normalizing this vector");
    }
    try {
      ww = await w.normalize();
    } catch (e) {
      throw new VError("Vector3D.dot_cosine(): error normalizing vector argument");
    }
    
    let d = vv._x * ww._x + vv._y * ww._y + vv._z * ww._z;
    if (isOverflow(d)) {
      throw new VError("Vector3D.dot_cosine: error getting dot product");
    }
    return d;
  }

  /// Computes the angle from this vector to the given vector.
  public async angleTo(w: this): Promise<number> {
    let lv, lw;
    try {
      lv = await this.length();
    } catch (e) {
      throw new VError(e as Error, "Vector3D.angle_to: error getting length of this vector");
    }
    try {
      lw = await w.length();
    } catch (e) {
      throw new VError(e as Error, "Vector3D.angle_to: error getting length of vector argument");
    }
    
    let u = this.clone().sub(w);
    let c;
    try {
      c = await u.length();
    } catch (e) {
      throw new VError(e as Error, "Vector3D.angle_to: error getting length of vector difference");
    };

    let a = Math.max(lv, lw);
    let b = Math.min(lv, lw);

    let res = inscribedAngleTriangle(a, b, c);
    return resultFromCalculation(res);
  }

  /// Gets a vector perpendicular to this vector.
  public getPerpendicularVector(): this {
    let x = this._x;
    let y = this._y;

    let tol = 0.015625;
    if (Math.abs(x) < tol && Math.abs(y) < tol) {
      return new Vector3D(this._z, 0.0, -this._x) as this;
    } else {
      return new Vector3D(this._y, -this._x, 0.0) as this;
    }
  }

  /// Calculates the cross product between this vector and a given vector.
  public cross(v: this): this {
    let a1 = this._x;
    let a2 = this._y;
    let a3 = this._z;

    let b1 = v._x;
    let b2 = v._y;
    let b3 = v._z;

    const newX = a2 * b3 - a3 * b2;
    const newY =  -(a1 * b3 - a3 * b1);
    const newZ =  a1 * b2 - a2 * b1;

    if (isOverflow(newX) || isOverflow(newY) || isOverflow(newZ)) {
      throw new VError("Vector3D.cross(): cross resulted in overflow");
    }
    return new Vector3D(newX, newY, newZ) as this;
  }

  /// Gets a vector with unit length codirectional to this vector.
  public async normalize(): Promise<this> {
    let ln;
    try {
      ln = await this.length();
    } catch(e) {
      throw new VError("Vector3D.normalize(): error getting length of this vector"); 
    }
    if (ln === 0.0) {
      throw new VError("Vector3D.get_normalized_vector: length of this is zero length");
    }
    const newX = this._x / ln;
    const newY = this._y / ln;
    const newZ = this._z / ln;
    if (isOverflow(newX) || isOverflow(newY) || isOverflow(newZ)) {
      throw new VError("Vector3D.normalize(): cross resulted in overflow");
    }
    return new Vector3D(newX, newY, newZ) as this;
  }

  /// Returns true if the given vector's components are equal to the zero vector within a tolerance.
  public async isZeroLength(tol: number): Promise<boolean> {
    return this.isEqualTol(Vector3D.ZERO_3D as this, tol)
  }

  /// Returns true if the given vector's components are equal to the normalized vector codirectional to this vector within a tolerance.
  public async isUnitLength(tol: number): Promise<boolean> {
    let v;
    try {
      v = await this.clone().normalize();
    } catch (e) {
      throw new VError("Vector3D.is_unit_length: error normalizing this vector");
    }
    return this.isEqualTol(v, tol);
  }

  /// Returns true if the given vector is parallel to this vector within a tolerance.
  public async isParallelTo(w: this, tol: number): Promise<boolean> {
    if (!isValidTolerance(tol)) {
      throw new VError("Vector3D.is_parallel_to(): invalid tolerance");
    }

    let v1, v2, d;
    try {
      v1 = await this.clone().normalize();
    } catch (e) {
      throw new VError("Vector3D.is_parallel_to: error getting normalized vector");
    }
    try {
      v2 = await w.clone().normalize();
    } catch (e) {
      throw new VError("Vector3D.is_parallel_to: error getting normalized vector");
    }
    try {
      d = await v1.dot(v2);
    } catch (e) {
      throw new VError("Vector3D.is_parallel_to: error getting dot product between vectors");
    }

    let t = Math.abs(d) - 1.0;
    return Math.abs(t) <= tol;
  }

  /// Returns true if the given vector is perpendicular to this vector within a tolerance.
  public async isPerpendicularTo(w: this, tol: number): Promise<boolean> {
    if (!isValidTolerance(tol)) {
      throw new VError("Vector3D.is_perpendicular_to(): invalid tolerance");
    }

    let v1, v2, d;
    try {
      v1 = await this.clone().normalize();
    } catch (e) {
      throw new VError("Vector3D.is_perpendicular_to: error getting normalized vector");
    }
    try {
      v2 = await w.clone().normalize();
    } catch (e) {
      throw new VError("Vector3D.is_perpendicular_to: error getting normalized vector");
    }
    try {
      d = await v1.dot(v2);
    } catch (e) {
      throw new VError("Vector3D.is_perpendicular_to: error getting dot product between vectors");
    }

    return d <= tol;
  }

  /// Returns true if the given vector is the vector is codirectional to this vector.
  public async isCodirectionalTo(w: this, tol: number): Promise<boolean> {
    if (!isValidTolerance(tol)) {
      throw new VError("Vector3D.is_codirectional_to(): invalid tolerance");
    }

    let d;
    try {
      d = await this.dot(w);
    } catch (e) {
      throw new VError(e as Error, "Vector3D.is_codirectional_to: error getting dot product for vector codirectionality");
    }

    if (d < 0.0) {
      return false;
    }
    
    let is_parallel;
    try {
      is_parallel = await this.isParallelTo(w, tol)
    } catch(e) {
      throw new VError("Vector3D.is_codirectional_to: error determining parallelism between vectors");
    };

    return is_parallel;
  }
}

// #[cfg(test)]
// mod tests {
//   use super::*;
//   #[test]
//   fn vec3d_create() {
//     let v = Vector3D{x: 2.0, y: 3.0, z: 5.0};
//     assert_eq!(v.x, 2.0);
//     assert_eq!(v.y, 3.0);
//     assert_eq!(v.z, 5.0);
//   }
//   #[test]
//   fn vec3d_get_components() {
//     let v = Vector3D{x: 2.0, y: 3.0, z: 5.0};
//     assert_eq!(v.x, 2.0);
//     assert_eq!(v.y, 3.0);
//     assert_eq!(v.z, 5.0);
//     let (x, y, z) = v.get_components();
//     assert_eq!(x, 2.0);
//     assert_eq!(y, 3.0);
//     assert_eq!(z, 5.0);
//   }
//   #[test]
//   fn vec3d_get_length() {
//     let v = Vector3D{x: 3.0, y: 4.0, z: 5.0};
//     let h = v.length();
//     assert_eq!(h.is_err(), false);
//     assert_eq!(h.unwrap(), number::sqrt(50.0));
//     let hsq = v.length_squared();
//     assert_eq!(hsq.is_err(), false);
//     assert_eq!(hsq.unwrap(), 50.0);
//   }
//   #[test]
//   fn vec3d_get_angle() {
//     let v0 = Vector3D{x: 3.0, y: -4.0, z: 5.0 };
//     let v1 = Vector3D{x: 2.0, y: 7.0, z: -3.0 };
//     let ra0 = v0.angle_to(v1);
//     assert_eq!(ra0.is_err(), false);

//     let wolfram_ans = 2.297673876007866989;
//     assert_eq!((ra0.unwrap() - wolfram_ans) < 1e-14, true);
//   }
//   #[test]
//   fn vec3d_get_perp_vector() {
//     let v0 = Vector3D{x: 3.0, y: -4.0, z: 5.0 };
//     let v1 = v0.get_perpendicular_vector();
//     let d = v0.dot(v1);
//     assert_eq!(d.is_err(), false);
//     assert_eq!(d.unwrap() < 1e-14, true);
//   }
//   #[test]
//   fn vec3d_get_norm_vector() {
//     let v0 = Vector3D{x: 3.0, y: -4.0, z: 5.0 };
//     let v1 = v0.get_normalized_vector();
//     assert_eq!(v1.is_err(), false);
//     let v1 = v1.unwrap();
//     let len = v1.length();
//     assert_eq!(len.is_err(), false);
//     let len = len.unwrap();
//     assert_eq!((len - 1.0) < 1e-14, true);

//     let is_codir = v0.is_codirectional_to(v1, 1e-14);
//     assert_eq!(is_codir.is_err(), false);
//     assert_eq!(is_codir.unwrap(), true);
//   }
//   #[test]
//   fn vec3d_is_equal_to() {
//     let v0 = Vector3D{x: 3.0, y: -4.0, z: 5.0};
//     let e = 1e-14;
//     let v1 = Vector3D{x: 3.0 + e, y: -4.0 + e, z: 5.0 + e};

//     let res1 = v0.is_equal_tol(v1, e * 2.0);
//     assert_eq!(res1.is_err(), false);
//     assert_eq!(res1.unwrap(), true);

//     let res2 = v0.is_equal_tol(v1, e);
//     assert_eq!(res2.is_err(), false);
//     assert_eq!(res2.unwrap(), false);

//     let z = Vector3D{x: e, y: e, z: e};
//     let res3 = z.is_zero_length(e);
//     assert_eq!(res3.is_err(), false);
//     assert_eq!(res3.unwrap(), true);
//   }
// }