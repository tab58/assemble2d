export const circleCircleTangentEnergyFunc = (x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): number => {
  const a = x0 - x1;
  const b = y0 - y1;
  const c = r0 + r1;
  const f = a * a + b * b - c * c;
  return f * f;
};

export const circleCircleTangentEnergyGrad = (x0: number, y0: number, r0: number, x1: number, y1: number, r1: number, output: number[]): number[] => {
  const a = x0 - x1;
  const b = y0 - y1;
  const c = r0 + r1;
  const h = a * a + b * b - c * c;

  // h = (x0 - x1)^2 + (y0 - y1)^2 - (r0 + r1)^2
  // f = h**2
  
  const dhx0 = 2 * (x0 - x1);
  const dhy0 = 2 * (y0 - y1);
  const dhr0 = -2 * (r0 + r1);
  const dhx1 = -2 * (x0 - x1);
  const dhy1 = -2 * (y0 - y1);
  const dhr1 = -2 * (r0 + r1);

  output[0] = 2 * h * dhx0;
  output[1] = 2 * h * dhy0;
  output[2] = 2 * h * dhr0;
  output[3] = 2 * h * dhx1;
  output[4] = 2 * h * dhy1;
  output[5] = 2 * h * dhr1;
  return output;
};