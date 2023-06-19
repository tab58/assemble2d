export const fixedPointEnergyFunc = (x0: number, y0: number, a: number, b: number): number => {
  let dx = x0 - a;
  let dy = y0 - b;
  return dx * dx + dy * dy;
};

export const fixedPointEnergyGrad = (x0: number, y0: number, a: number, b: number, output: number[]): number[] => {
  output[0] = 2 * (x0 - a);
  output[1] = 2 * (y0 - b);
  return output;
};