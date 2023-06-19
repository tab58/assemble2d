import { VError } from "verror";

export const VectorN = {
  new: (size: number): number[] => {
    const v = [];
    for (let i = 0; i < size; i++) {
      v[i] = 0;
    }
    return v;
  },
  size: (v: number[]): number => {
    return v.length;
  },
  assertSameSize: (v: number[], w: number[]): void => {
    if (VectorN.size(v) !== VectorN.size(w)) {
      throw new VError("number[].dot(): sizes of vector are mismatched.");
    }
    return;
  },
  // Copies the values from the argument into v and returns v.
  copy: (dest: number[], src: number[]): number[] => {
    VectorN.assertSameSize(dest, src);
    for (let i = 0; i < dest.length; i++) {
      dest[i] = src[i];
    }
    return dest;
  },
  // Adds the vectors in-place and returns this number[], similar to axpy.
  scale: (a: number, x: number[], output: number[]): number[] => {
    VectorN.assertSameSize(output, x);
    if (Number.isNaN(a) || !Number.isFinite(a)) {
      throw new VError("number[].scaleAndAdd(): scale is not valid");
    }

    for (let i = 0; i < output.length; i++) {
      output[i] = a * x[i];
    }
    return output;
  },
  // Adds the vectors in-place and returns this number[], similar to axpy.
  scaleAndAdd: (y: number[], a: number, x: number[], output: number[]): number[] => {
    VectorN.assertSameSize(y, x);
    VectorN.assertSameSize(y, output);
    if (Number.isNaN(a) || !Number.isFinite(a)) {
      throw new VError("number[].scaleAndAdd(): scale is not valid");
    }

    for (let i = 0; i < y.length; i++) {
      output[i] = y[i] + a * x[i];
    }
    return output;
  },
  dot: (v: number[], w: number[]): number => {
    VectorN.assertSameSize(v, w);
    let sum = 0;
    for (let i = 0; i < v.length; i++) {
      sum += w[i] * v[i];
    }
    return sum;
  }
}