import VError from "verror";

import { Vector2D } from "./vector2";
import {
  isOverflow,
  isValidTolerance,
} from "./numeric";

// Row-major 2x2 Matrix.
export class Matrix2D {
  // Creates a new identity matrix from the given elements.
  public static identity(): Matrix2D {
    return new Matrix2D([1, 0, 0, 1]);
  }

  private _elements: [number, number, number, number];

  constructor(elements: number[]) {
    this._elements = elements.slice(0, 4) as [number, number, number, number];
  }
  
  public get a00(): number {
    return this._elements[0];
  }

  public get a01(): number {
    return this._elements[1];
  }

  public get a10(): number {
    return this._elements[2];
  }

  public get a11(): number {
    return this._elements[3];
  }

  // Pretty-prints the matrix.
  public print(): string {
    return `([{${this._elements[0]}}, {${this._elements[1]}}], [{${this._elements[2]}}, {${this._elements[3]}}])`;
  }

  // Creates a new matrix from the given elements.
  public clone(): this {
    return new Matrix2D(this._elements) as this;
  }

  // Adds the given matrix to this matrix in-place.
  public add(w: this): void {
    this._elements[0] += w._elements[0];
    this._elements[1] += w._elements[1];
    this._elements[2] += w._elements[2];
    this._elements[3] += w._elements[3];
  }

  // Subtracts the given matrix from this matrix in-place.
  public sub(w: this): void {
    this._elements[0] -= w._elements[0];
    this._elements[1] -= w._elements[1];
    this._elements[2] -= w._elements[2];
    this._elements[3] -= w._elements[3];
  }

  // Computes the product of two matrices and stores the result in the output matrix.
  private mul(left: this, right: this, output: this): this {
    const a = left._elements[0];
    const b = left._elements[1];
    const c = left._elements[2];
    const d = left._elements[3];

    const e = right._elements[0];
    const f = right._elements[1];
    const g = right._elements[2];
    const h = right._elements[3];

    output._elements[0] = a * e + b * g;
    output._elements[1] = a * f + b * h;
    output._elements[2] = c * e + d * g;
    output._elements[3] = c * f + d * h;

    return output;
  }

  // Multiplies this matrix on the left by the given matrix and returns the result (result = w * this).
  public lmul(w: this): this {
    return this.mul(w, this, this);
  }

  // Multiplies this matrix on the right by the given matrix and returns the result (result = this * w).
  public rmul(w: this): this {
    return this.mul(this, w, this);
  }

  // Sets the matrix to the identity matrix in-place.
  public toIdentity(): void {
    this._elements = [1.0, 0.0, 0.0, 1.0];
  }

  // Transposes the matrix in-place.
  public transpose(): void {
    const tmp = this._elements[1];
    this._elements[1] = this._elements[2];
    this._elements[2] = tmp;
  }

  // Sets the matrix to the adjugate in-place and returns it.
  public adjugate(): this {
    const [a, b, c, d] = this._elements;
    this._elements[0] = d;
    this._elements[1] = -b;
    this._elements[2] = -c;
    this._elements[3] = a;
    return this;
  }

  // Gets the determinant of the matrix.
  public determinant(): number {
    const [a, b, c, d] = this._elements;
    return a * d - b * c;
  }

  // Gets the row of this matrix at the given index as a vector.
  public async getRow(row: number): Promise<Vector2D> {
    switch (row) {
      case 0:
        return new Vector2D(this._elements[0], this._elements[1]);
      case 1:
        return new Vector2D(this._elements[2], this._elements[3]);
      default:
        throw new VError("Matrix2D.getRow: index should be 0 or 1");
    }
  }

  // Gets the column of this matrix at the given index as a vector.
  public async getCol(col: number): Promise<Vector2D> {
    switch (col) {
      case 0:
        return new Vector2D(this._elements[0], this._elements[2]);
      case 1:
        return new Vector2D(this._elements[1], this._elements[3]);
      default:
        throw new VError("Matrix2D.getCol: index should be 0 or 1");
    }
  }

   /// Multiplies this matrix by the given scalar value.
   public async scale(s: number): Promise<this> {
    if (isNaN(s)) {
      throw new VError("Matrix2D.scale: scale factor is NaN");
    }
    let e0 = this._elements[0] * s;
    let e1 = this._elements[1] * s;
    let e2 = this._elements[2] * s;
    let e3 = this._elements[3] * s;
    if (isOverflow(e0) || isOverflow(e1) || isOverflow(e2) || isOverflow(e3)) {
      throw new VError("Matrix2D.scale: overflowed element");
    }
    return this;
  }

  // Inverts this matrix in-place and returns it. Throws an error if the determinant is zero.
  public async invert(): Promise<this> {
    const det = this.determinant();
    if (det === 0.0) {
      throw new Error("Matrix2D.invert: determinant is zero");
    }
    return this.adjugate().scale(1.0 / det);
  }

  // Returns true if the matrix is singular within the given tolerance (determinant < tol).
  public async isSingular(tol: number): Promise<boolean> {
    if (!isValidTolerance(tol)) {
      throw new VError("Matrix2D.isSingular: invalid tolerance");
    }

    let det = this.determinant();
    return Math.abs(det) < tol;
  }

  // Modifies the vector in-place and returns it.
  public async applyToVector(v: Vector2D): Promise<Vector2D> {
    const a = this._elements[0];
    const b = this._elements[1];
    const newX = a * v.x + b * v.y;
    const c = this._elements[2];
    const d = this._elements[3];
    const newY = c * v.x + d * v.y;
    if (isOverflow(newX) || isOverflow(newY)) {
      throw new VError("Matrix2D.applyToVector: overflowed result");
    }
    v.set(newX, newY);
    return v;
  }
}

// #[cfg(test)]
// mod tests {
//   use super::*;

//   #[test]
//   fn matrix2d_create() {
//     let elems: [f64; 4] = [2.0, 3.0, 5.0, 7.0];
//     let v = Matrix2D{ elements: elems };
//     assert_eq!(v.elements[0], 2.0);
//     assert_eq!(v.elements[1], 3.0);
//     assert_eq!(v.elements[2], 5.0);
//     assert_eq!(v.elements[3], 7.0);
//   }

//   #[test]
//   fn matrix2d_identity() {
//     let v = Matrix2D::identity();
//     assert_eq!(v.elements[0], 1.0);
//     assert_eq!(v.elements[1], 0.0);
//     assert_eq!(v.elements[2], 0.0);
//     assert_eq!(v.elements[3], 1.0);
//   }

//   #[test]
//   fn matrix2d_transpose() {
//     let elems: [f64; 4] = [2.0, 3.0, 5.0, 7.0];
//     let v = Matrix2D{ elements: elems };
//     let vt = v.transpose();

//     assert_eq!(v.elements[0], vt.elements[0]);
//     assert_eq!(v.elements[1], vt.elements[2]);
//     assert_eq!(v.elements[2], vt.elements[1]);
//     assert_eq!(v.elements[3], vt.elements[3]);
//   }

//   #[test]
//   fn matrix2d_get_row() {
//     let elems: [f64; 4] = [2.0, 3.0, 5.0, 7.0];
//     let v = Matrix2D{ elements: elems };

//     let r1 = v.get_row(0);
//     assert!(r1.is_ok());
//     let r1 = r1.unwrap();
//     assert_eq!(r1.x(), v.elements[0]);
//     assert_eq!(r1.y(), v.elements[1]);

//     let r2 = v.get_row(1);
//     assert!(r2.is_ok());
//     let r2 = r2.unwrap();
//     assert_eq!(r2.x(), v.elements[2]);
//     assert_eq!(r2.y(), v.elements[3]);

//     let r3 = v.get_row(3);
//     assert!(r3.is_err());
//   }

//   #[test]
//   fn matrix2d_get_col() {
//     let elems: [f64; 4] = [2.0, 3.0, 5.0, 7.0];
//     let v = Matrix2D{ elements: elems };

//     let r1 = v.get_col(0);
//     assert!(r1.is_ok());
//     let r1 = r1.unwrap();
//     assert_eq!(r1.x(), v.elements[0]);
//     assert_eq!(r1.y(), v.elements[2]);

//     let r2 = v.get_col(1);
//     assert!(r2.is_ok());
//     let r2 = r2.unwrap();
//     assert_eq!(r2.x(), v.elements[1]);
//     assert_eq!(r2.y(), v.elements[3]);

//     let r3 = v.get_row(3);
//     assert!(r3.is_err());
//   }

//   #[test]
//   fn matrix2d_singular() {
//     let sing_elems: [f64; 4] = [2.0, 1.0, 4.0, 2.0];
//     let v_singular = Matrix2D{ elements: sing_elems };
//     let res = v_singular.is_singular(1e-14);
//     assert!(res.is_ok());
//     assert_eq!(res.unwrap(), true);

//     let elems: [f64; 4] = [2.0, 1.0, 4.0, 5.0];
//     let v = Matrix2D{ elements: elems };
//     let res = v.is_singular(1e-14);
//     assert!(res.is_ok());
//     assert_eq!(res.unwrap(), false);
//   }

//   #[test]
//   fn matrix2d_scale() {
//     let elems: [f64; 4] = [2.0, 3.0, 5.0, 7.0];
//     let v = Matrix2D{ elements: elems };
//     let s = 4.0;
//     let res = v.scale(s);
//     assert!(res.is_ok());
//     let m = res.unwrap();
//     assert_eq!(m.elements[0], v.elements[0] * s);
//     assert_eq!(m.elements[1], v.elements[1] * s);
//     assert_eq!(m.elements[2], v.elements[2] * s);
//     assert_eq!(m.elements[3], v.elements[3] * s);
//   }

//   #[test]
//   fn matrix2d_apply_to_vector() {
//     let elems: [f64; 4] = [2.0, 3.0, 5.0, 7.0];
//     let m = Matrix2D{ elements: elems };
//     let v = Vector2D::new(11.0, 13.0 );

//     let res = m.apply_to_vector(v);
//     assert!(res.is_ok());
//     let w = res.unwrap();
//     assert_eq!(w.x(), 2.0 * 11.0 + 3.0 * 13.0);
//     assert_eq!(w.y(), 5.0 * 11.0 + 7.0 * 13.0);
//   }
// }