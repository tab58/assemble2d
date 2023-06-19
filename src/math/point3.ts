import VError from "verror";

import { Vector3D } from "./vector3";
import {
  isOverflow
} from "./numeric";

/// A 3-dimensional mathematical point.
/// 
/// Points are more contextual because of their need to reference an origin and they should be
/// passed by reference whenever possible.
export class Point3D {
  public static ORIGIN_3D: Point3D = new Point3D(0.0, 0.0, 0.0);
  public static POINT_AT_INFINITY_3D: Point3D = new Point3D(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);

  private _x: number;
  private _y: number;
  private _z: number;

  public print(): string {
    return `({${this._x}}, {${this._y}}, {${this._z})`;
  }

  public constructor(x: number, y: number, z: number) {
    this._x = x;
    this._y = y;
    this._z = z;
  }

  public fromVector(v: Vector3D): this {
    return new Point3D(v.x, v.y, v.z) as this;
  }

  public clone(): this {
    return new Point3D(this._x, this._y, this._z) as this;
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

  public isOrigin(): boolean {
    return this._x === Point3D.ORIGIN_3D._x &&
      this._y === Point3D.ORIGIN_3D._y &&
      this._z === Point3D.ORIGIN_3D._z;
  }

  public isAtInfinity(): boolean {
    return Math.abs(this._x) === Point3D.POINT_AT_INFINITY_3D._x &&
      Math.abs(this._y) === Point3D.POINT_AT_INFINITY_3D._y &&
      Math.abs(this._z) === Point3D.POINT_AT_INFINITY_3D._z;
  }

  // Displaces the point by the given vector.
  public async add(v: Vector3D): Promise<this> {
    const newX = this._x + v.x;
    const newY = this._y + v.y;
    const newZ = this._z + v.z;
    if (isOverflow(newX) || isOverflow(newY) || isOverflow(newZ)) {
      throw new VError("Point3D.add(): overflowed result");
    }
    this.set(newX, newY, newZ);
    return this;
  }

  // Displaces the point by the negative of the given vector.
  public async sub(v: Vector3D): Promise<this> {
    const newX = this._x - v.x;
    const newY = this._y - v.y;
    const newZ = this._z - v.z;
    if (isOverflow(newX) || isOverflow(newY) || isOverflow(newZ)) {
      throw new VError("Point3D.add(): overflowed result");
    }
    this.set(newX, newY, newZ);
    return this;
  }

  // Creates a displacement vector from the canonical origin.
  public asVector(): Vector3D {
    return new Vector3D(this._x, this._y, this._z);
  }

  public async vectorTo(p: this): Promise<Vector3D> {
    const newX = p._x - this._x;
    const newY = p._y - this._y;
    const newZ = p._z - this._z;
    if (isOverflow(newX) || isOverflow(newY) || isOverflow(newZ)) {
      throw new VError("Point3D.vector_to(): overflowed result");
    }
    return new Vector3D(newX, newY, newZ);
  }
}

// #[cfg(test)]
// mod tests {
//   use super::*;
//   #[test]
//   fn point3d_create() {
//     let p = Point3D{x: 2.0, y: 3.0, z: 5.0};
//     assert_eq!(p.x, 2.0);
//     assert_eq!(p.y, 3.0);
//     assert_eq!(p.z, 5.0);
//   }

//   #[test]
//   fn point3d_get_coordinates() {
//     let p = Point3D{x: 2.0, y: 3.0, z: 5.0};
//     let vcoords = p.get_coordinates();
//     assert_eq!(vcoords.0, p.x());
//     assert_eq!(vcoords.1, p.y());
//     assert_eq!(vcoords.2, p.z());
//   }

//   #[test]
//   fn point3d_as_vector() {
//     let p = Point3D{x: 2.0, y: 3.0, z: 5.0};
//     let v = p.as_vector();
//     assert_eq!(p.x, v.x());
//     assert_eq!(p.y, v.y());
//     assert_eq!(p.z, v.z());
//   }

//   #[test]
//   fn point3d_add() {
//     let p = Point3D{x: 2.0, y: 3.0, z: 5.0};
//     let v = Vector3D::new(7.0, 11.0, 13.0);
//     let res = p.add(v);
//     assert!(res.is_ok());
//     assert_eq!(p.x, 2.0 + 7.0);
//     assert_eq!(p.y, 3.0 + 11.0);
//     assert_eq!(p.z, 5.0 + 13.0);
//   }

//   #[test]
//   fn point3d_sub() {
//     let p = Point3D{x: 7.0, y: 11.0, z: 13.0};
//     let v = Vector3D::new(2.0, 3.0, 5.0);
//     let res = p.sub(v);
//     assert!(res.is_ok());
//     assert_eq!(p.x, 7.0 - 2.0);
//     assert_eq!(p.y, 11.0 - 3.0);
//     assert_eq!(p.z, 13.0 - 5.0);
//   }
// }