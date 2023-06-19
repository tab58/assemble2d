import VError from "verror";

import { Point2D } from "src/math/point2";
import { Vector2D } from "src/math/vector2";
import { Line2D } from "./line2";
import {
  isOverflow,
} from "../math/numeric";

export class Circle2D {
  private _center: Point2D;
  private _radius: number;

  private constructor(center: Point2D, radius: number) {
    this._center = center;
    this._radius = radius;
  }

  /// Constructs a Circle2D from a center point and a radius.
  public static async create(center: Point2D, radius: number): Promise<Circle2D> {
    if (Math.abs(radius) === Number.POSITIVE_INFINITY) {
      throw new VError("Circle2D.new(): radius is infinite");
    }
    if (isNaN(radius)) {
      throw new VError("Circle2D.new(): radius is NaN");
    }
    if (radius < 0.0) {
      throw new VError("Circle2D.new(): radius is negative");
    }
    return new Circle2D(center.clone(), radius);
  }

  /// Constructs a Circle2D from a center point and a point on the circle.
  public static async newFromCenterAndPoint(center_point: Point2D, p: Point2D): Promise<Circle2D> {
    const v = await center_point.vectorTo(p);
    const r = await v.length();
    return new Circle2D(center_point.clone(), r);
  }

  public static async newFrom3Points(p1: Point2D, p2: Point2D, p3: Point2D, tol: number): Promise<Circle2D> {
    // test for collinearity
    const v12 = await p1.vectorTo(p2);
    const v13 = await p1.vectorTo(p3);

    const l12 = await Line2D.create(p1, v12);
    const isPointOnL12 = await l12.isPointOn(p3, tol);
    if (isPointOnL12) {
      throw new VError("CircularArc2D.from_3_points(): arc points are collinear");
    }

    // calculate center from construction
    let v12_mid;
    try {
      v12_mid = await v12.scale(0.5);
    } catch (e) {
      throw new VError(e as Error, "CircularArc2D.from_3_points(): could not get midpoint between p1-p2");
    }
    let v13_mid;
    try {
      v13_mid = await v13.scale(0.5);
    } catch (e) {
      throw new VError(e as Error, "CircularArc2D.from_3_points(): could not get midpoint between p1-p3");
    }
    
    const l12_mid = new Point2D(p1.x + v12_mid.x, p1.y + v12_mid.y);
    const l13_mid = new Point2D(p1.x + v13_mid.x, p1.y + v13_mid.y);

    const p12_mid_perp = v12.getPerpendicular();
    const p13_mid_perp = v13.getPerpendicular();

    const l12_p = await Line2D.create(l12_mid, p12_mid_perp);
    const l13_p = await Line2D.create(l13_mid, p13_mid_perp);

    const center = l12_p.intersectsLine(l13_p);
    
    // get circle radius
    const vr = await center.vectorTo(p1);
    let r; 
    try {
      r = await vr.length();
    } catch (e) {
      throw new VError(e as Error, "CircularArc2D.from_3_points(): could not get radius between center and p1");
    }
    return new Circle2D(center, r);
  }

  /// Constructs a Circle2D from the coordinates of the center point and the radius.
  public static async newFromCoordinates(x: number, y: number, radius: number): Promise<Circle2D> {
    if (isOverflow(x) || isOverflow(y) || isOverflow(radius)) {
      throw new VError("Circle2D.newFromCoordinates(): overflowed result");
    }
    return new Circle2D(new Point2D(x, y), radius);
  }

  public getCenter(): Point2D {
    return this._center.clone();
  }

  public getRadius(): number {
    return this._radius;
  }

  public async isPointOn(p: Point2D, tol: number): Promise<boolean> {
    if (Math.abs(this._radius) < 1e-14) {
      throw new VError("Circle2D.isPointOn: radius is too small")
    }
    
    // calculate point on
    let cx = this._center.x;
    let cy = this._center.y;
    let r = this._radius;
    let px = p.x;
    let py = p.y;

    // calculate a point on the circle closest to p
    let dx = px - cx;
    let dy = py - cy;
    let diff = new Vector2D(dx, dy);
    let norm_diff = await diff.normalize();
    let direction_to_p = norm_diff;
    
    let c_to_p = await direction_to_p.scale(r);
    let p_prime = this._center.clone();
    await p_prime.add(c_to_p);

    // determine distance from p to p'
    let dp = await p_prime.vectorTo(p);
    let dr = await dp.length();

    return (dr <= tol);
  }
}

// #[cfg(test)]
// mod tests {
//   use super::*;
  
//   #[test]
//   fn circle2d_get_radius() {
//     let unit_rad = 1.0;
//     let center = Point2D::new(0.0, 0.0);
//     let c = Circle2D {
//       center: center,
//       radius: unit_rad
//     };

//     let r = c.get_radius();
//     assert_eq!(r, unit_rad);
//   }

//   #[test]
//   fn circle2d_is_point_on() {
//     let center = Point2D::new(0.0, 0.0);
//     let c = Circle2D {
//       center: center,
//       radius: 1.0
//     };

//     let p = Point2D::new(1.0 + 1e-13, 0.0);
//     let res = c.is_point_on(p, 1e-14);
//     assert!(res.is_ok());
//     assert_eq!(res.unwrap(), false);
    
//     let p = Point2D::new(1.0 + 1e-14, 0.0);
//     let res = c.is_point_on(p, 1e-14);
//     assert!(res.is_ok());
//     assert_eq!(res.unwrap(), true);
//   }
// }