export const pointOnLineEnergyFunc = (x0: number, y0: number, x1: number, y1: number, x: number, y: number): number => {
  // const u = (x1 - x0);
  // const v = (y1 - y0);
  // const h = v * (x0 - x) - u * (y0 - y);
  const h = (y1 - y0) * (x0 - x) - (x1 - x0) * (y0 - y);
  return h * h;
};

export const pointOnLineEnergyGrad = (x0: number, y0: number, x1: number, y1: number, x: number, y: number, output: number[]): number[] => {
  const h = (y1 - y0) * (x0 - x) - (x1 - x0) * (y0 - y);

  const dhx0 = y1 - y;
  const dhy0 = x - x1;
  const dhx1 = y - y0;
  const dhy1 = x0 - x;
  const dhx = y0 - y1;
  const dhy = x1 - x0;

  output[0] = 2 * h * dhx0;
  output[1] = 2 * h * dhy0;
  output[2] = 2 * h * dhx1;
  output[3] = 2 * h * dhy1;
  output[4] = 2 * h * dhx;
  output[5] = 2 * h * dhy;
  return output;
};