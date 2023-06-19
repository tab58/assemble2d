import VError from "verror";

import { Vector2D } from "./vector2";
import {
  isOverflow
} from "./numeric";

/// A 2-dimensional mathematical point.
/// 
/// Points are more contextual because of their need to reference the origin.
export class Point2D {
  public static ORIGIN_2D: Point2D = new Point2D(0.0, 0.0);
  public static POINT_AT_INFINITY_2D: Point2D = new Point2D(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);

  private _x: number;
  private _y: number;

  public constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  public clone(): this {
    return new Point2D(this._x, this._y) as this;
  }

  public print(): string {
    return `({${this._x}}, {${this._y}})`;
  }

  public fromVector(v: Vector2D): this {
    return new Point2D(v.x, v.y) as this;
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

  // Creates a displacement vector from the canonical origin.
  public asVector(): Vector2D {
    return new Vector2D(this._x, this._y);
  }

  /// Gets the distance between this point and a given point as a vector.
  public async vectorTo(p: this): Promise<Vector2D> {
    let newX = p._x - this._x;
    let newY = p._y - this._y;
    if (isOverflow(newX) || isOverflow(newY)) {
      throw new VError("Point2D.vector_to(): overflowed result");
    }
    return new Vector2D(newX, newY);
  }

  public isOrigin(): boolean {
    return this._x === Point2D.ORIGIN_2D._x &&
      this._y === Point2D.ORIGIN_2D._y;
  }

  public isAtInfinity(): boolean {
    return Math.abs(this._x) === Point2D.POINT_AT_INFINITY_2D._x &&
      Math.abs(this._y) === Point2D.POINT_AT_INFINITY_2D._y;
  }

  // Displaces the point by the given vector.
  public async add(v: Vector2D): Promise<this> {
    const newX = this._x + v.x;
    const newY = this._y + v.y;
    if (isOverflow(newX) || isOverflow(newY)) {
      throw new VError("Point2D.add(): overflowed result");
    }
    this._x = newX;
    this._y = newY;
    return this;
  }

  // Displaces the point by the negative of the given vector.
  public async sub(v: Vector2D): Promise<this> {
    const newX = this._x - v.x;
    const newY = this._y - v.y;
    if (isOverflow(newX) || isOverflow(newY)) {
      throw new VError("Point2D.sub(): overflowed result");
    }
    this._x = newX;
    this._y = newY;
    return this;
  }
}

// #[cfg(test)]
// mod tests {
//   use super::*;
//   #[test]
//   fn point2d_create() {
//     let v = Point2D{x: 2.0, y: 3.0};
//     assert_eq!(v.x, 2.0);
//     assert_eq!(v.y, 3.0);
//   }

//   #[test]
//   fn point2d_get_coordinates() {
//     let v = Point2D{x: 2.0, y: 3.0};
//     let vcoords = v.get_coordinates();
//     assert_eq!(vcoords.0, 2.0);
//     assert_eq!(vcoords.1, 3.0);
//   }

//   #[test]
//   fn point2d_as_vector() {
//     let p = Point2D{x: 2.0, y: 3.0};
//     let v = p.as_vector();
//     assert_eq!(p.x, v.x());
//     assert_eq!(p.y, v.y());
//   }

//   #[test]
//   fn point2d_add() {
//     let p = Point2D::new(2.0, 3.0);
//     let v = Vector2D::new(5.0, 7.0);
//     let res = p.add(v);
//     assert!(res.is_ok());
//     assert_eq!(p.x, 2.0 + 5.0);
//     assert_eq!(p.y, 3.0 + 7.0);
//   }

//   #[test]
//   fn point2d_sub() {
//     let p = Point2D::new(5.0, 7.0);
//     let v = Vector2D::new(2.0, 3.0);
//     let res = p.sub(v);
//     assert!(res.is_ok());
//     assert_eq!(p.x, 5.0 - 2.0);
//     assert_eq!(p.y, 7.0 - 3.0);
//   }
// }