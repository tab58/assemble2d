export const pointOnCircleEnergyFunc = (x0: number, y0: number, cx: number, cy: number, r: number): number => {
  const a = x0 - cx;
  const b = y0 - cy;
  const h = a * a + b * b - r * r;
  return h * h;
};

export const pointOnCircleEnergyGrad = (x0: number, y0: number, cx: number, cy: number, r: number, output: number[]): number[] => {
  const a = x0 - cx;
  const b = y0 - cy;
  const h = a * a + b * b - r * r;

  // h = (x0 - cx)^2 + (y0 - cy)^2 - r^2
  // f = h**2

  const dfx0 = 2 * (x0 - cx);
  const dfy0 = 2 * (y0 - cy);
  const dfcx = -2 * (x0 - cx);
  const dfcy = -2 * (y0 - cy);
  const dfr = -2 * r;

  output[0] = 2 * h * dfx0;
  output[1] = 2 * h * dfy0;
  output[2] = 2 * h * dfcx;
  output[3] = 2 * h * dfcy;
  output[4] = 2 * h * dfr;
  return output;
};