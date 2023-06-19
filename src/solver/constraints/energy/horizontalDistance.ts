export const horizontalDistanceEnergyFunc = (x0: number, y0: number, x1: number, y1: number, l: number): number => {
  const h = (x1 - x0) * (x1 - x0) - l * l;
  return h * h;
};

export const horizontalDistanceEnergyGrad = (x0: number, y0: number, x1: number, y1: number, l: number, output: number[]): number[] => {
  const h = (x1 - x0) * (x1 - x0) - l * l;

  const dhx0 = -2 * (x1 - x0);
  const dhy0 = 0;
  const dhx1 =  2 * (x1 - x0);
  const dhy1 = 0;

  output[0] = 2 * h * dhx0;
  output[1] = 2 * h * dhy0;
  output[2] = 2 * h * dhx1;
  output[3] = 2 * h * dhy1;
  return output;
};