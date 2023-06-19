import VError from "verror";

import { Vector3D } from "./vector3";
import {
  isOverflow,
  isValidTolerance,
} from "./numeric";

/// A 3x3 matrix. 
/// 
/// Elements are in row-major format.
export class Matrix3D {
  private elements: number[];

  public constructor(elements: number[]) {
    this.elements = elements.slice(0, 9);
  }

  public get a00(): number {
    return this.elements[0];
  }

  public get a01(): number {
    return this.elements[1];
  }

  public get a02(): number {
    return this.elements[2];
  }

  public get a10(): number {
    return this.elements[3];  
  }

  public get a11(): number {
    return this.elements[4];
  }

  public get a12(): number {
    return this.elements[5];
  }

  public get a20(): number {
    return this.elements[6];
  }

  public get a21(): number {
    return this.elements[7];
  }

  public get a22(): number {
    return this.elements[8];
  }

  public clone(): this {
    return new Matrix3D(this.elements) as this;
  }

  public print(): string {
    const a00 = this.elements[0];
    const a01 = this.elements[1];
    const a02 = this.elements[2];
    const a10 = this.elements[3];
    const a11 = this.elements[4];
    const a12 = this.elements[5];
    const a20 = this.elements[6];
    const a21 = this.elements[7];
    const a22 = this.elements[8];

    return `([{${a00}}}, {${a01}}, {${a02}}], [{${a10}}}, {${a11}}, {${a12}}], [{${a20}}}, {${a21}}, {${a22}}])`;
  }
  
  public add(w: this): this {
    const a00 = this.elements[0] + w.elements[0];
    const a01 = this.elements[1] + w.elements[1];
    const a02 = this.elements[2] + w.elements[2];
    const a10 = this.elements[3] + w.elements[3];
    const a11 = this.elements[4] + w.elements[4];
    const a12 = this.elements[5] + w.elements[5];
    const a20 = this.elements[6] + w.elements[6];
    const a21 = this.elements[7] + w.elements[7];
    const a22 = this.elements[8] + w.elements[8];
    this.elements[0] = a00;
    this.elements[1] = a01;
    this.elements[2] = a02;
    this.elements[3] = a10;
    this.elements[4] = a11;
    this.elements[5] = a12;
    this.elements[6] = a20;
    this.elements[7] = a21;
    this.elements[8] = a22;
    return this;
  }

  public sub(w: this): this {
    const a00 = this.elements[0] - w.elements[0];
    const a01 = this.elements[1] - w.elements[1];
    const a02 = this.elements[2] - w.elements[2];
    const a10 = this.elements[3] - w.elements[3];
    const a11 = this.elements[4] - w.elements[4];
    const a12 = this.elements[5] - w.elements[5];
    const a20 = this.elements[6] - w.elements[6];
    const a21 = this.elements[7] - w.elements[7];
    const a22 = this.elements[8] - w.elements[8];
    this.elements[0] = a00;
    this.elements[1] = a01;
    this.elements[2] = a02;
    this.elements[3] = a10;
    this.elements[4] = a11;
    this.elements[5] = a12;
    this.elements[6] = a20;
    this.elements[7] = a21;
    this.elements[8] = a22;
    return this;
  }

  private mul(v: this, w: this, output: this): this {
    const [a, b, c, d, e, f, g, h, i] = v.elements;
    const [j, k, l, m, n, o, p, q, r] = w.elements;
    const a00 = a * j + b * m + c * p;
    const a01 = a * k + b * n + c * q;
    const a02 = a * l + b * o + c * r;
    const a10 = d * j + e * m + f * p;
    const a11 = d * k + e * n + f * q;
    const a12 = d * l + e * o + f * r;
    const a20 = g * j + h * m + i * p;
    const a21 = g * k + h * n + i * q;
    const a22 = g * l + h * o + i * r;
    output.elements[0] = a00;
    output.elements[1] = a01;
    output.elements[2] = a02;
    output.elements[3] = a10;
    output.elements[4] = a11;
    output.elements[5] = a12;
    output.elements[6] = a20;
    output.elements[7] = a21;
    output.elements[8] = a22;
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

  public getElements(): number[] {
    return this.elements.slice(0, 9);
  }

  public toIdentity(): this {
    this.elements = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0];
    return this;
  }

  public transpose(): this {
    let tmp = this.elements[1]; // 1 -> 3
    this.elements[1] = this.elements[3];
    this.elements[3] = tmp;

    tmp = this.elements[2]; // 2 -> 6
    this.elements[2] = this.elements[6];
    this.elements[6] = tmp;

    tmp = this.elements[5]; // 5 -> 7
    this.elements[5] = this.elements[7];
    this.elements[7] = tmp;

    return this;
  }

  public async getRow(row: number): Promise<Vector3D> {
    switch (row) {
      case 0:
        return new Vector3D(this.elements[0], this.elements[1], this.elements[2] );
      case 1:
        return new Vector3D(this.elements[3], this.elements[4], this.elements[5] );
      case 2:
        return new Vector3D(this.elements[6], this.elements[7], this.elements[8] );
      default:
        throw new VError("Matrix3D.get_row(): invalid index");
    }
  }

  public async getCol(col: number): Promise<Vector3D> {
    switch (col) {
      case 0:
        return new Vector3D(this.elements[0], this.elements[3], this.elements[6] );
      case 1:
        return new Vector3D(this.elements[1], this.elements[4], this.elements[7] );
      case 2:
        return new Vector3D(this.elements[2], this.elements[5], this.elements[8] );
      default:
        throw new VError("Matrix3D.get_row(): invalid index");
    }
  }

  public adjugate(): this {
    const [a, b, c, d, e, f, g, h, i] = this.elements;
    const b0 = e * i - f * h;
    const b1 = -(b * i - c * h);
    const b2 = b * f - c * e;
    const b3 = -(d * i - f * g);
    const b4 = a * i - c * g;
    const b5 = -(a * f - c * d);
    const b6 = d * h - e * g;
    const b7 = -(a * h - b * g);
    const b8 = a * e - b * d;
    this.elements[0] = b0;
    this.elements[1] = b1;
    this.elements[2] = b2;
    this.elements[3] = b3;
    this.elements[4] = b4;
    this.elements[5] = b5;
    this.elements[6] = b6;
    this.elements[7] = b7;
    this.elements[8] = b8;
    return this;
  }

  public async invert(): Promise<this> {
    const det = this.determinant();
    if (det === 0.0) {
      throw new VError("Matrix3D.get_inverse(): determinant is zero");
    }
    return this.adjugate().scale(1.0 / det);
  }

  public determinant(): number {
    const [a, b, c, d, e, f, g, h, i] = this.elements;
    return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)
  }

  public async isSingular(tol: number): Promise<boolean> {
    if (!isValidTolerance(tol)) {
      throw new VError("Matrix3D.is_singular(): invalid tolerance");
    }
    const det = this.determinant();
    return (Math.abs(det) < tol);
  }

  public async scale(s: number): Promise<this> {
    if (isNaN(s)) {
      throw new VError("Matrix3D.scale(): scale factor is NaN");
    }

    const e0 = this.elements[0] * s;
    const e1 = this.elements[1] * s;
    const e2 = this.elements[2] * s;
    const e3 = this.elements[3] * s;
    const e4 = this.elements[4] * s;
    const e5 = this.elements[5] * s;
    const e6 = this.elements[6] * s;
    const e7 = this.elements[7] * s;
    const e8 = this.elements[8] * s;
    if (isOverflow(e0) || isOverflow(e1) || isOverflow(e2) ||
      isOverflow(e3) || isOverflow(e4) || isOverflow(e5) || 
      isOverflow(e6) || isOverflow(e7) || isOverflow(e8)) {
      throw new VError("Matrix3D.scale(): overflowed result");
    }
    this.elements[0] = e0;
    this.elements[1] = e1;
    this.elements[2] = e2;
    this.elements[3] = e3;
    this.elements[4] = e4;
    this.elements[5] = e5;
    this.elements[6] = e6;
    this.elements[7] = e7;
    this.elements[8] = e8;
    return this;
  }

  public async applyToVector(v: Vector3D): Promise<Vector3D> {
    let a = this.elements[0];
    let b = this.elements[1];
    let c = this.elements[2];
    const newX = a * v.x + b * v.y + c * v.z;
    a = this.elements[3];
    b = this.elements[4];
    c = this.elements[5];
    const newY = a * v.x + b * v.y + c * v.z;
    a = this.elements[6];
    b = this.elements[7];
    c = this.elements[8];
    const newZ = a * v.x + b * v.y + c * v.z;

    if (isOverflow(newX) || isOverflow(newY) || isOverflow(newZ)) {
      throw new VError("Matrix3D.apply_to_vector(): overflowed result");
    }
    v.set(newX, newY, newZ);
    return v;
  }
}

// #[cfg(test)]
// mod tests {
//   use super::*;
//   #[test]
//   fn matrix3d_create() {
//     let elems: [number; 9] = [2.0, 3.0, 5.0, 7.0, 11.0, 13.0, 17.0, 19.0, 23.0];
//     let v = Matrix3D{ elements: elems };
//     assert_eq!(v.elements[0], 2.0);
//     assert_eq!(v.elements[1], 3.0);
//     assert_eq!(v.elements[2], 5.0);
//     assert_eq!(v.elements[3], 7.0);
//     assert_eq!(v.elements[4], 11.0);
//     assert_eq!(v.elements[5], 13.0);
//     assert_eq!(v.elements[6], 17.0);
//     assert_eq!(v.elements[7], 19.0);
//     assert_eq!(v.elements[8], 23.0);
//   }

//   #[test]
//   fn matrix3d_identity() {
//     let v = Matrix3D::identity();
//     assert_eq!(v.elements[0], 1.0);
//     assert_eq!(v.elements[1], 0.0);
//     assert_eq!(v.elements[2], 0.0);
//     assert_eq!(v.elements[3], 0.0);
//     assert_eq!(v.elements[4], 1.0);
//     assert_eq!(v.elements[5], 0.0);
//     assert_eq!(v.elements[6], 0.0);
//     assert_eq!(v.elements[7], 0.0);
//     assert_eq!(v.elements[8], 1.0);
//   }

//   #[test]
//   fn matrix3d_transpose() {
//     let elems: [number; 9] = [2.0, 3.0, 5.0, 7.0, 11.0, 13.0, 17.0, 19.0, 23.0];
//     let v = Matrix3D{ elements: elems };
//     let vt = v.transpose();

//     assert_eq!(v.elements[0], vt.elements[0]);
//     assert_eq!(v.elements[1], vt.elements[3]);
//     assert_eq!(v.elements[2], vt.elements[6]);
//     assert_eq!(v.elements[3], vt.elements[1]);
//     assert_eq!(v.elements[4], vt.elements[4]);
//     assert_eq!(v.elements[5], vt.elements[7]);
//     assert_eq!(v.elements[6], vt.elements[2]);
//     assert_eq!(v.elements[7], vt.elements[5]);
//     assert_eq!(v.elements[8], vt.elements[8]);
//   }

//   #[test]
//   fn matrix3d_get_row() {
//     let elems: [number; 9] = [2.0, 3.0, 5.0, 7.0, 11.0, 13.0, 17.0, 19.0, 23.0];
//     let v = Matrix3D{ elements: elems };

//     let r = v.get_row(0);
//     assert!(r.is_ok());
//     let r = r.unwrap();
//     assert_eq!(r.x(), v.elements[0]);
//     assert_eq!(r.y(), v.elements[1]);
//     assert_eq!(r.z(), v.elements[2]);

//     let r = v.get_row(1);
//     assert!(r.is_ok());
//     let r = r.unwrap();
//     assert_eq!(r.x(), v.elements[3]);
//     assert_eq!(r.y(), v.elements[4]);
//     assert_eq!(r.z(), v.elements[5]);

//     let r = v.get_row(2);
//     assert!(r.is_ok());
//     let r = r.unwrap();
//     assert_eq!(r.x(), v.elements[6]);
//     assert_eq!(r.y(), v.elements[7]);
//     assert_eq!(r.z(), v.elements[8]);

//     let r = v.get_row(3);
//     assert!(r.is_err());
//   }

//   #[test]
//   fn matrix3d_get_col() {
//     let elems: [number; 9] = [2.0, 3.0, 5.0, 7.0, 11.0, 13.0, 17.0, 19.0, 23.0];
//     let v = Matrix3D{ elements: elems };

//     let r = v.get_col(0);
//     assert!(r.is_ok());
//     let r = r.unwrap();
//     assert_eq!(r.x(), v.elements[0]);
//     assert_eq!(r.y(), v.elements[3]);
//     assert_eq!(r.z(), v.elements[6]);

//     let r = v.get_col(1);
//     assert!(r.is_ok());
//     let r = r.unwrap();
//     assert_eq!(r.x(), v.elements[1]);
//     assert_eq!(r.y(), v.elements[4]);
//     assert_eq!(r.z(), v.elements[7]);

//     let r = v.get_col(2);
//     assert!(r.is_ok());
//     let r = r.unwrap();
//     assert_eq!(r.x(), v.elements[2]);
//     assert_eq!(r.y(), v.elements[5]);
//     assert_eq!(r.z(), v.elements[8]);

//     let r = v.get_col(3);
//     assert!(r.is_err());
//   }

//   #[test]
//   fn matrix3d_singular() {
//     let elems: [number; 9] = [2.0, 3.0, 5.0, 7.0, 11.0, 13.0, 14.0, 22.0, 26.0];
//     let v_singular = Matrix3D{ elements: elems };
//     let res = v_singular.is_singular(1e-14);
//     assert!(res.is_ok());
//     assert_eq!(res.unwrap(), true);

//     let elems: [number; 9] = [2.0, 3.0, 5.0, 7.0, 11.0, 13.0, 17.0, 19.0, 23.0];
//     let v = Matrix3D{ elements: elems };
//     let res = v.is_singular(1e-14);
//     assert!(res.is_ok());
//     assert_eq!(res.unwrap(), false);
//   }

//   #[test]
//   fn matrix3d_scale() {
//     let elems: [number; 9] = [2.0, 3.0, 5.0, 7.0, 11.0, 13.0, 17.0, 19.0, 23.0];
//     let v = Matrix3D{ elements: elems };
//     let s = 4.0;
//     let res = v.scale(s);
//     assert!(res.is_ok());
//     let m = res.unwrap();
//     assert_eq!(m.elements[0], v.elements[0] * s);
//     assert_eq!(m.elements[1], v.elements[1] * s);
//     assert_eq!(m.elements[2], v.elements[2] * s);
//     assert_eq!(m.elements[3], v.elements[3] * s);
//     assert_eq!(m.elements[4], v.elements[4] * s);
//     assert_eq!(m.elements[5], v.elements[5] * s);
//     assert_eq!(m.elements[6], v.elements[6] * s);
//     assert_eq!(m.elements[7], v.elements[7] * s);
//     assert_eq!(m.elements[8], v.elements[8] * s);
//   }

//   #[test]
//   fn matrix3d_apply_to_vector() {
//     let elems: [number; 9] = [2.0, 3.0, 5.0, 7.0, 11.0, 13.0, 17.0, 19.0, 23.0];
//     let m = Matrix3D{ elements: elems };
//     let v = Vector3D::new(27.0, 29.0, 31.0 );

//     let res = m.apply_to_vector(v);
//     assert!(res.is_ok());
//     let w = res.unwrap();
//     assert_eq!(w.x(), 2.0 * 27.0 + 3.0 * 29.0 + 5.0 * 31.0);
//     assert_eq!(w.y(), 7.0 * 27.0 + 11.0 * 29.0 + 13.0 * 31.0);
//     assert_eq!(w.z(), 17.0 * 27.0 + 19.0 * 29.0 + 23.0 * 31.0);
//   }
// }