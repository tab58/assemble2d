export const midpointEnergyFunc = (x0: number, y0: number, x1: number, y1: number, x: number, y: number): number => {
  const a = x - x0;
  const b = y - y0;
  const c = x - x1;
  const d = y - y1;
  const h = a * a + b * b - c * c - d * d;
  return h * h;
};

export const midpointEnergyGrad = (x0: number, y0: number, x1: number, y1: number, x: number, y: number, output: number[]): number[] => {
  const a = x - x0;
  const b = y - y0;
  const c = x - x1;
  const d = y - y1;
  const h = a * a + b * b - c * c - d * d;
  
  // h = (x - x0)^2 + (y - y0)^2 - (x - x1)^2 - (y - y1)^2
  // f = h**2

  const dhx0 = -2 * (x - x0);
  const dhy0 = -2 * (y - y0);
  const dhx1 = -2 * (x - x1);
  const dhy1 = -2 * (y - y1);
  const dhx  = 2 * (x - x0) - 2 * (x - x1);
  const dhy  = 2 * (y - y0) - 2 * (y - y1);

  output[0] = 2 * h * dhx0;
  output[1] = 2 * h * dhy0;
  output[2] = 2 * h * dhx1;
  output[3] = 2 * h * dhy1;
  output[4] = 2 * h * dhx;
  output[5] = 2 * h * dhy;
  return output;
};
