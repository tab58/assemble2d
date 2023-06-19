export const concentricEnergyFunc = (x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): number => {
  let dx = x1 - x0;
  let dy = y1 - y0;
  return dx * dx + dy * dy;
};

export const concentricEnergyGrad = (x0: number, y0: number, r0: number, x1: number, y1: number, r1: number, output: number[]): number[] => {
  output[0] = 2 * (x1 - x0) * (-1);
  output[1] = 2 * (y1 - y0) * (-1);
  output[2] = 0.0;
  output[3] = 2 * (x1 - x0);
  output[4] = 2 * (y1 - y0);
  output[5] = 0.0;
  return output;
};