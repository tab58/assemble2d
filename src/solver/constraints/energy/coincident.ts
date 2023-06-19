export const coincidentEnergyFunc = (x0: number, y0: number, x1: number, y1: number): number => {
  let dx = x1 - x0;
  let dy = y1 - y0;
  return dx * dx + dy * dy;
};

export const coincidentEnergyGrad = (x0: number, y0: number, x1: number, y1: number, output: number[]): number[] => {
  output[0] = -2.0 * x1 + 2.0 * x0;
  output[1] = 2.0 * x1 - 2.0 * x0;
  output[2] = -2.0 * y1 + 2.0 * y0;
  output[3] = 2.0 * y1 - 2.0 * y0;
  return output;
};
