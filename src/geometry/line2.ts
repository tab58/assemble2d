import VError from 'verror';

import { Point2D } from '../math/point2';
import { Vector2D } from '../math/vector2';
import { Vector3D } from '../math/vector3';

/// Constructed by a point and a unit direction.
export class Line2D {
  private point: Point2D;
  private direction: Vector2D;

  private constructor(point: Point2D, direction: Vector2D) {
    this.point = point;
    this.direction = direction;
  }

  public getPoint(): Point2D {
    return this.point.clone();
  }

  public getDirection(): Vector2D {
    return this.direction.clone();
  }

  public static async create(point: Point2D, direction: Vector2D): Promise<Line2D> {
    const d = await direction.normalize();
    return new Line2D(point.clone(), d);
  }

  public static async newFrom2Points(start: Point2D, end: Point2D): Promise<Line2D> {
    let d = await start.vectorTo(end);
    return Line2D.create(start, d);
  }

  /// Defines a line from an ordered triple that represents the coefficients in the equation ax + by + c = 0.
  public static async newFromTriple(a: number, b: number, c: number): Promise<Line2D> {
    let d = new Vector2D(b, -a);
    if (a != 0.0) {
      let p = new Point2D(-c / a, 0.0);
      return Line2D.create(p, d);
    } else if (b !== 0.0) {
      let p = new Point2D(0.0, -c / b);
      return Line2D.create(p, d);
    } else {
      // a === 0 and b === 0
      let origin = new Point2D(0.0, 0.0);
      return Line2D.create(origin, d);
    }
  }

  /// Calculates the intersection between this line and a given line.
  /// Returns (Inf, Inf) if the lines are parallel (i.e. intersects at infinity).
  public intersectsLine(line: Line2D): Point2D {
    let thisTriple = this.getTriple();
    let lineTriple = line.getTriple();

    let homIntersect = thisTriple.cross(lineTriple);

    let x = homIntersect.x;
    let y = homIntersect.y;
    let w = homIntersect.z;

    if (w === 0.0) {
      return Point2D.POINT_AT_INFINITY_2D.clone();
    } else {
      return new Point2D(x / w, y / w);
    }
  }

  /// True if the point is at the origin and the direction is a zero-length vector, false if not.
  public isZeroLengthLine(): boolean {
    return this.point.x === 0.0 && this.point.y === 0.0 &&
      this.direction.x === 0.0 && this.direction.y === 0.0;
  }
  
  /// Gets the triple (a, b, c) that represents the implicit equation ax + by + c = 0.
  /// This is a Vector3D for implicit intersection calculations.
  public getTriple(): Vector3D {
    let x0 = this.point.x;
    let y0 = this.point.y;
    let u = this.direction.x;
    let v = this.direction.y;
    return new Vector3D(-v, u, v * x0 - u * y0);
  }

  /// Determines if the given point is on the line, true if yes, false if no.
  public async isPointOn(p: Point2D, tol: number): Promise<boolean> {
    let triple = this.getTriple();
    let x = p.x;
    let y = p.y;
    let homP = new Vector3D(x, y, 1.0);
    const d = await triple.dot(homP);
    return (Math.abs(d) < tol);
  }

  /// Calculates the point as a function of the parameter t with the formula P = (point + direction * t).
  public getPointFromParameter(t: number): Point2D {
    let u = this.direction.x;
    let v = this.direction.y;
    let x0 = this.point.x;
    let y0 = this.point.y;
    return new Point2D(x0 + t * u, y0 + t * v);
  }

  /// Gets the closest point on the line to the given point.
  public async getClosestPointTo(q: Point2D, tol: number): Promise<Point2D> {
    let q_p0 = await this.getPoint().vectorTo(q);
    let n = this.getDirection().clone();
    let t = await n.dot(q_p0);

    let p = this.getPointFromParameter(t);
    if (await this.isPointOn(p, tol)) {
      return p;
    } else {
      throw new VError("InfiniteLine2D.get_closest_point_to: cannot get point on line within tolerance");
    }
  }

  /// Gets the perpendicular line to this one that passes through the point p.
  public getPerpLine(p: Point2D): Line2D {
    let u = this.direction.x;
    let v = this.direction.y;
    return new Line2D(p.clone(), new Vector2D(-v, u));
  }
  
  /// Determines if the given line is collinear to this one within a given tolerance.
  public async isCollinearTo(line: Line2D, tol: number): Promise<boolean> {
    let lp = line.point;
    let onThis;
    try {
      onThis = await this.isPointOn(lp, tol);
    } catch (e) {
      throw new VError(e as Error, "InfiniteLine2D.is_collinear_to: cannot determine point on line status")
    }

    let colThis;
    try {
      colThis = await this.direction.isParallelTo(line.direction, tol)
    } catch (e) {
      throw new VError("InfiniteLine2D.is_collinear_to: cannot determine direction collinearity status")
    }
    return (onThis && colThis);
  }

  /// Determines if the given line is parallel to this one within a given tolerance.
  public async isParallelTo(line: Line2D, tol: number): Promise<boolean> {
    return line.direction.isParallelTo(this.direction, tol);
  }

  /// Determines if the given line is perpendicular to this one within a given tolerance.
  public is_perpendicular_to(line: Line2D, tol: number): Promise<boolean> {
    return this.direction.isPerpendicularTo(line.direction, tol);
  }
}

// #[cfg(test)]
// mod tests {
//   use crate::linalg::{Point2D, Vector2D};
//   use super::*;
  
//   #[test]
//   fn infinite_line2d_get_triple() {
//     let line = Line2D{
//       point: Point2D::new(-1.0, -1.0 ),
//       direction: Vector2D::new(2.0, -1.0 )
//     };
//     let triple = line.get_triple();
//     assert_eq!(triple.x(), 1.0);
//     assert_eq!(triple.y(), 2.0);
//     assert_eq!(triple.z(), 3.0);
//   }

//   #[test]
//   fn infinite_line2d_from_triple() {
//     let x = 1.0;
//     let y = 2.0;
//     let z = 3.0;
//     let line = Line2D::new_from_triple(x, y, z);
//     assert!(line.is_ok());
//     let triple = line.unwrap().get_triple();
//     assert_eq!(triple.x(), x);
//     assert_eq!(triple.y(), y);
//     assert_eq!(triple.z(), z);
//   }

//   #[test]
//   fn infinite_line2d_zero_length_line() {
//     let x = 0.0;
//     let y = 0.0;
//     let z = 0.0;
//     let line = Line2D::new_from_triple(x, y, z);
//     assert!(line.is_ok());
//     let line = line.unwrap();
//     assert!(line.is_zero_length_line());

//     let line = Line2D::new_from_triple(1e-14, y, z);
//     assert!(line.is_ok());
//     let line = line.unwrap();
//     assert!(!line.is_zero_length_line());
//   }

//   #[test]
//   fn infinite_line2d_get_perp_line() {
//     let line = Line2D{
//       point: Point2D::new(1.0, 1.0 ),
//       direction: Vector2D::new(-3.0, 7.0 )
//     };
//     let q = Point2D::new(2.0, 5.0 );
//     let perp = line.get_perp_line(q);

//     assert_eq!(perp.point.x(), q.x());
//     assert_eq!(perp.point.y(), q.y());
//     assert_eq!(perp.direction.x(), -line.direction.y());
//     assert_eq!(perp.direction.y(), line.direction.x());
//   }

//   #[test]
//   fn infinite_line2d_parallel_to() {
//     // obviously parallel
//     let line1 = Line2D{
//       point: Point2D::new(0.0, 0.0 ),
//       direction: Vector2D::new(1.0, 0.0 )
//     };
//     let line2 = Line2D{
//       point: Point2D::new(0.0, 1.0 ),
//       direction: Vector2D::new(-1.0, 0.0 )
//     };
//     let res1 = line1.is_parallel_to(line2, 1e-14);
//     assert!(res1.is_ok());
//     let res1 = res1.unwrap();
//     assert_eq!(res1, true);

//     // obviously not parallel
//     let line3 = Line2D{
//       point: Point2D::new(0.0, 1.0 ),
//       direction: Vector2D::new(1.0, 1.0 )
//     };
//     let res2 = line1.is_parallel_to(line3, 1e-14);
//     assert!(res2.is_ok());
//     let res2 = res2.unwrap();
//     assert_eq!(res2, false);

//     // slightly parallel
//     let line3 = Line2D{
//       point: Point2D::new(0.0, 1.0 ),
//       direction: Vector2D::new(1.0, 5e-14 )
//     };
//     let res2 = line1.is_parallel_to(line3, 1e-13);
//     assert!(res2.is_ok());
//     let res2 = res2.unwrap();
//     assert_eq!(res2, true);
//   }

//   #[test]
//   fn infinite_line2d_collinear_to() {
//     let line1 = Line2D{
//       point: Point2D::new(0.0, 0.0 ),
//       direction: Vector2D::new(1.0, 0.0 )
//     };
//     let line2 = Line2D{
//       point: Point2D::new(2.0, 0.0 ),
//       direction: Vector2D::new(-1.0, 0.0 )
//     };
//     let res1 = line1.is_collinear_to(line2, 1e-14);
//     assert!(res1.is_ok());
//     let res1 = res1.unwrap();
//     assert_eq!(res1, true);

//     let line3 = Line2D{
//       point: Point2D::new(2.0, 1e-14 ),
//       direction: Vector2D::new(-1.0, 0.0 )
//     };
//     let res2 = line1.is_collinear_to(line3, 1e-14);
//     assert!(res2.is_ok());
//     let res2 = res2.unwrap();
//     assert_eq!(res2, false);
//   }

//   #[test]
//   fn infinite_line2d_perpendicular_to() {
//     // obviously perpendicular
//     let line1 = Line2D{
//       point: Point2D::new(0.0, 0.0 ),
//       direction: Vector2D::new(1.0, 0.0 )
//     };
//     let line2 = Line2D{
//       point: Point2D::new(2.0, 0.0 ),
//       direction: Vector2D::new(0.0, -1.0 )
//     };
//     let res = line1.is_perpendicular_to(line2, 1e-14);
//     assert!(res.is_ok());
//     let res = res.unwrap();
//     assert_eq!(res, true);

//     // slightly not perpendicular
//     let line3 = Line2D{
//       point: Point2D::new(2.0, 0.0 ),
//       direction: Vector2D::new(1.5e-14, -1.0 )
//     };
//     let res = line1.is_perpendicular_to(line3, 1e-14);
//     assert!(res.is_ok());
//     let res = res.unwrap();
//     assert_eq!(res, false);
//   }
// }