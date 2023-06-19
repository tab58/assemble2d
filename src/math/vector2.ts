import { VError } from "verror";

import {
  twoProduct,
  twoSum,
  isOverflow,
  isValidTolerance,
  resultFromCalculation,
  nrm2,
  inscribedAngleTriangle
} from "./numeric";

/// A 2-dimensional mathematical vector.
/// 
/// Since points are more contextual because of their need to reference an origin, they should be
/// passed by reference whenever possible. Vectors should be value-based and copied when possible.
export class Vector2D {
  public static ZERO_2D = new Vector2D(0.0, 0.0);
  public static XAXIS_2D = new Vector2D(1.0, 0.0);
  public static YAXIS_2D = new Vector2D(0.0, 1.0);

  private _x: number;
  private _y: number;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public setX(x: number): void {
    this._x = x;
  }

  public setY(y: number): void {
    this._y = y;
  }

  public set(x: number, y: number): void {
    this._x = x;
    this._y = y;
  }

  public print(): string {
    return `({${this._x}}, {${this._y}})`;
  }

  public clone(): this {
    return new Vector2D(this._x, this._y) as this;
  }

  public async dot(w: Vector2D): Promise<number> {
    // let d = (self.x * w.x) + (self.y * w.y);
    let x1 = this._x;
    let x2 = this._y;
    let y1 = w._x;
    let y2 = w._y;

    let [p, s] = twoProduct(x1, y1);
    // for i in 2..3 {
    let [h, r] = twoProduct(x2, y2);
    let [pp, qq] = twoSum(p, h);
    p = pp;
    s = s + (qq + r);
    // }
    let d = p + s;

    if (isOverflow(d)) {
      throw new VError("Vector2D.dot(): overflowed product");
    }
    return d;
  }

  public async isEqualTol(w: Vector2D, tol: number): Promise<boolean> {
    if (!isValidTolerance(tol)) {
      throw new VError("Vector2D.is_equal_tol(): invalid tolerance");
    }

    let x = Math.abs(this._x - w._x);
    let y = Math.abs(this._y - w._y);

    let isEqual = x <= tol && y <= tol;
    return isEqual;
  }

  // Returns this vector.
  public async scale(s: number): Promise<this> {
    let newX = this._x * s;
    let newY = this._y * s;
    if (isOverflow(newX) || isOverflow(newY)) {
      throw new VError("Vector2D.scale(): overflowed product");
    }
    this._x = newX;
    this._y = newY;
    return this;
  }

  // Returns this vector.
  public add(w: this): this {
    this._x += w._x;
    this._y += w._y;
    return this;
  }

  // Returns this vector.
  public sub(w: this): this {
    this._x -= w._x;
    this._y -= w._y;
    return this;
  }

  /// Gets the length of the vector.
  public async length(): Promise<number> {
    let len = nrm2(this._x, this._y);
    return resultFromCalculation(len);
  }

  /// Gets the squared length of the vector.
  public async lengthSquared(): Promise<number> {
    let x = this._x;
    let y = this._y;
    let len = x * x + y * y;
    return resultFromCalculation(len);
  }

  // Modifies unit length codirectional to this vector.
  // Returns this vector.
  public async normalize(): Promise<this> {
    let ln;
    try {
      ln = await this.length();
    } catch(e) {
      throw new VError(e as Error, "Vector2D.normalize(): could not get length of self");
    }
    if (ln === 0.0 || (this._x === 0.0 && this._y === 0.0)) {
      throw new VError("Vector2D.get_normalized_vector: vector to normalize has zero length");
    }
    this._x /= ln;
    this._y /= ln;
    return this;
  }

  public async angleBetweenVectors(w: this): Promise<number> {
    // formula by Kahan
    let u: Vector2D, v: Vector2D;
    try {
      u = await this.clone().normalize();
    } catch (e) {
      throw new VError(e as Error, "Vector2D.angle_between_vectors: unable to get u normalized vector");
    }
    try {
      v = await w.clone().normalize();
    } catch (e) {
      throw new VError(e as Error, "Vector2D.angle_between_vectors: unable to get v normalized vector");
    }

    let y: number, x: number;
    try {
      y = await u.clone().sub(v).length();
    } catch (e) {
      throw new VError(e as Error, "Vector2D.angle_between_vectors: unable to compute u-v");
    }
    try {
      x = await u.clone().add(v).length();
    } catch (e) {
      throw new VError(e as Error, "Vector2D.angle_between_vectors: unable to compute u+v");
    }
    return 2.0 * Math.atan2(y, x);
  }

  // Computes the cosine of the angle between the two vectors via the dot product.
  public async dotCosine(w: this): Promise<number> {
    let vv: Vector2D, ww: Vector2D;
    try {
      vv = await this.clone().normalize();
    } catch (e) {
      throw new VError(e as Error, "Vector2D.dot_cosine: unable to get normalized vector from this vector");
    }
    try {
      ww = await w.clone().normalize();
    } catch (e) {
      throw new VError(e as Error, "Vector2D.dot_cosine: unable to get normalized vector from argument vector");
    }
    const d = vv._x * ww._x + vv._y * ww._y;
    if (isOverflow(d)) {
      throw new VError("Vector2D.dot_cosine: unable to compute dot product for cosine");
    }
    return d;
  }

  /// Computes the angle from this vector to the given vector.
  public async angleTo(w: this): Promise<number> {
    let lv, lw;
    try {
      lv = await this.length();
    } catch (e) {
      throw new VError(e as Error, "Vector2D.angle_to: cannot get length of self")
    }
    try {
      lw = await w.length();
    } catch (e) {
      throw new VError(e as Error, "Vector2D.angle_to: cannot get length of argument")
    }

    const u = this.clone().sub(w);
    let c;
    try {
      c = await u.length();
    } catch (e) {
      throw new VError(e as Error, "Vector2D.angle_to: cannot get length of vector difference")
    }
    
    let a = Math.max(lv, lw);
    let b = Math.min(lv, lw);

    let res = inscribedAngleTriangle(a, b, c);
    return resultFromCalculation(res);
  }

  /// Computes the canonical angle in the 2D plane.
  public async angle(): Promise<number> {
    return this.angleTo(Vector2D.XAXIS_2D as this);
  }

  /// Gets a vector perpendicular to this vector.
  public getPerpendicular(): this {
    return new Vector2D(-this._y, this._x) as this;
  }

  /// Returns true if the given vector's components are equal to the zero vector within a tolerance.
  public async isZeroLength(tol: number): Promise<boolean> {
    return await this.isEqualTol(Vector2D.ZERO_2D, tol);
  }

  /// Returns true if the given vector's components are equal to the normalized vector codirectional to this vector within a tolerance.
  public async isUnitLength(tol: number): Promise<boolean> {    
    const v = await this.clone().normalize();
    return this.isEqualTol(v, tol);
  }

  /// Returns true if the given vector is parallel to this vector within a tolerance.
  public async isParallelTo(w: this, tol: number): Promise<boolean> {
    if (!isValidTolerance(tol)) {
      throw new VError("Vector2D.is_parallel_to(): invalid tolerance");
    }

    let v1: Vector2D, v2: Vector2D;
    try {
      v1 = await this.clone().normalize();
    } catch (e) {
      throw new VError(e as Error, "Vector2D.is_parallel_to: error getting normalized vector");
    }
    try {
      v2 = await w.clone().normalize();
    } catch (e) {
      throw new VError(e as Error, "Vector2D.is_parallel_to: error getting normalized vector");
    }

    const d = await v1.dot(v2);
    let t = Math.abs(Math.abs(d) - 1.0);
    return t <= tol;
  }

  /// Returns true if the given vector is perpendicular to this vector within a tolerance.
  public async isPerpendicularTo(w: this, tol: number): Promise<boolean> {
    if (!isValidTolerance(tol)) {
      throw new VError("Vector2D.is_perpendicular_to(): invalid tolerance");
    }

    let v1: Vector2D, v2: Vector2D;
    try {
      v1 = await this.clone().normalize();
    } catch (e) {
      throw new VError(e as Error, "Vector2D.is_perpendicular_to: error getting normalized vector");
    }
    try {
      v2 = await w.clone().normalize();
    } catch (e) {
      throw new VError(e as Error, "Vector2D.is_perpendicular_to: error getting normalized vector");
    }

    const d = await v1.dot(v2);
    return (d <= tol);
  }

  /// Returns true if the given vector is the vector is codirectional to this vector.
  public async isCodirectionalTo(w: this, tol: number): Promise<boolean> {
    if (!isValidTolerance(tol)) {
      throw new VError("Vector2D.is_codirectional_to(): invalid tolerance");
    }

    let v0: Vector2D, v1: Vector2D;
    try {
      v0 = await this.clone().normalize();
    } catch (e) {
      throw new VError(e as Error, "Vector2D.is_codirectional_to: error getting normalized vector");
    }
    try {
      v1 = await w.clone().normalize();
    } catch (e) {
      throw new VError(e as Error, "Vector2D.is_codirectional_to: error getting normalized vector");
    }

    // test to see if direction is the same
    const d = await v0.dot(v1);
    if (d < 0.0) {
      return false;
    }
    
    // test if lines are parallel
    let isParallel: boolean;
    try {
      isParallel = await v0.isParallelTo(v1, tol);
    } catch (e) {
      throw new VError(e as Error, "Vector2D.is_codirectional_to: error determining parallelism for vectors");
    }
    return isParallel;
  }
}

// #[cfg(test)]
// mod tests {
//   use super::*;
//   #[test]
//   fn vec2d_create() {
//     let v = Vector2D{x: 2.0, y: 3.0};
//     assert_eq!(v.x, 2.0);
//     assert_eq!(v.y, 3.0);
//   }
//   #[test]
//   fn vec2d_get_components() {
//     let v = Vector2D{x: 2.0, y: 3.0};
//     assert_eq!(v.x, 2.0);
//     assert_eq!(v.y, 3.0);
//     let (x, y) = v.get_components();
//     assert_eq!(x, 2.0);
//     assert_eq!(y, 3.0);
//   }
//   #[test]
//   fn vec2d_get_length() {
//     let v = Vector2D{x: 3.0, y: 4.0};
//     let h = v.length();
//     assert_eq!(h.is_err(), false);
//     assert_eq!(h.unwrap(), 5.0);
//     let hsq = v.length_squared();
//     assert_eq!(hsq.is_err(), false);
//     assert_eq!(hsq.unwrap(), 25.0);
//   }
//   #[test]
//   fn vec2d_get_angle() {
//     let v0 = Vector2D{x: f64::sqrt(3.0) / 2.0, y: 0.5 };
//     let ra0 = v0.angle();
//     assert_eq!(ra0.is_err(), false);
//     let a0 = ra0.unwrap();
//     assert_eq!(a0, std::f64::consts::PI / 6.0);
//   }
//   #[test]
//   fn vec2d_dot() {
//     let v0 = Vector2D{x: 2.0, y: 3.0};
//     let v1 = Vector2D{x: 5.0, y: 7.0};
//     let d = v0.dot(v1);
//     assert_eq!(d.is_err(), false);
//     assert_eq!(d.unwrap(), 31.0);
//   }
//   #[test]
//   fn vec2d_perp_vector() {
//     let v0 = Vector2D{x: 2.3, y: 3.7};
//     let p = v0.get_perpendicular_vector();
//     let d = v0.dot(p);
//     assert_eq!(d.is_err(), false);
//     assert_eq!(f64::abs(d.unwrap()) < 1e-14, true);
//   }
//   #[test]
//   fn vec2d_normalized_vector() {
//     let v0 = Vector2D{x: 2.3, y: 3.7};
//     let vres = v0.get_normalized_vector();
//     assert_eq!(vres.is_err(), false);
//     let res = vres.unwrap().length();
//     assert_eq!(res.is_err(), false);
//     assert_eq!((res.unwrap() - 1.0) < 1e-14, true);
//   }
//   #[test]
//   fn vec2d_almost_equal_vectors() {
//     let e = 1e-13;
//     let v0 = Vector2D{x: 2.3, y: 3.7};
//     let v1 = Vector2D{x: v0.x, y: v0.y - e};
//     let equal_res = v0.is_equal_tol(v1, e);
//     assert_eq!(equal_res.is_err(), false);
//     assert_eq!(equal_res.unwrap(), true);
//   }
//   #[test]
//   fn vec2d_zero_vector() {
//     let e = 1e-13;
//     let v0 = Vector2D{x: e, y: 0.0};
//     let zero_res = v0.is_zero_length(e);
//     assert_eq!(zero_res.is_err(), false);
//     assert_eq!(zero_res.unwrap(), true);

//     let zero_res1 = v0.is_zero_length(1e-14);
//     assert_eq!(zero_res1.is_err(), false);
//     assert_eq!(zero_res1.unwrap(), false);
//   }
//   #[test]
//   fn vec2d_unit_vector() {
//     let e = 1e-13;
//     let v0 = Vector2D{x: 1.0 - e, y: 0.0};
//     let unit_res = v0.is_unit_length(2.0 * e);
//     assert_eq!(unit_res.is_err(), false);
//     assert_eq!(unit_res.unwrap(), true);
//   }
//   #[test]
//   fn vec2d_parallel_vectors() {
//     let e  = 1e-14;
//     let v0 = Vector2D{ x: 1.0, y: 2.0 };
//     let v1 = Vector2D{ x: -1.0 - e, y: -2.0 - e };
//     let unit_res = v0.is_parallel_to(v1, e);
//     assert_eq!(unit_res.is_err(), false);
//     assert_eq!(unit_res.unwrap(), true);

//     let v1 = Vector2D{ x: -1.0 - 1e-6, y: -2.0 - 1e-6 };
//     let unit_res = v0.is_parallel_to(v1, e);
//     assert_eq!(unit_res.is_err(), false);
//     assert_eq!(unit_res.unwrap(), false);
//   }
//   #[test]
//   fn vec2d_perp_vectors() {
//     let e = 1e-13;
//     let v0 = Vector2D{x: 1.0, y: 2.0};
//     let p0 = v0.get_perpendicular_vector();

//     println!("{}", p0);

//     let v1 = Vector2D{x: p0.x + e, y: p0.y + e};
//     let unit_res = v0.is_perpendicular_to(v1, e);
//     assert_eq!(unit_res.is_err(), false);
//     assert_eq!(unit_res.unwrap(), true);

//     let v1 = Vector2D{x: p0.x + (2.0 * e), y: p0.y + (2.0 * e)};
//     let unit_res = v0.is_perpendicular_to(v1, e);
//     assert_eq!(unit_res.is_err(), false);
//     assert_eq!(unit_res.unwrap(), false);
//   }
//   #[test]
//   fn vec2d_codirectional_vectors() {
//     let e = 1e-14;
    
//     let v0 = Vector2D{ x: 1.0, y: 2.0 };
//     let v1 = Vector2D{ x: 1.0 + e, y: 2.0 + e };
//     let res = v0.is_codirectional_to(v1, e);
//     assert_eq!(res.is_err(), false);
//     assert_eq!(res.unwrap(), true);

//     let v1 = Vector2D{ x: 1.0, y: 2.0 + 1e-6 };
//     let res = v0.is_codirectional_to(v1, e);
//     assert_eq!(res.is_err(), false);
//     assert_eq!(res.unwrap(), false);
//   }
// }