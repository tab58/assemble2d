export const distanceEnergyFunc = (x0: number, y0: number, x1: number, y1: number, d: number): number => {
  let u = x1 - x0;
  let v = y1 - y0;
  const h = u * u + v * v - d * d;
  return h * h;
}

export const distanceEnergyGrad = (x0: number, y0: number, x1: number, y1: number, d: number, output: number[]): number[] => {
  let u = x1 - x0;
  let v = y1 - y0;
  const h = u * u + v * v - d * d;

  const dhx0 = -2 * u;
  const dhy0 = -2 * v;
  const dhx1 =  2 * u;
  const dhy1 =  2 * v;

  output[0] = 2 * h * dhx0;
  output[1] = 2 * h * dhy0;
  output[2] = 2 * h * dhx1;
  output[3] = 2 * h * dhy1;
  return output;
};