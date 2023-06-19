export const verticalDistanceEnergyFunc = (x0: number, x1: number, y0: number, y1: number, l: number): number => {
  const h = (y1 - y0) * (y1 - y0) - l * l;
  return h * h;
};

export const verticalDistanceEnergyGrad = (x0: number, x1: number, y0: number, y1: number, l: number, output: number[]): number[] => {
  const h = (y1 - y0) * (y1 - y0) - l * l;
  
  const dhx0 = 0;
  const dhy0 = -2 * (y1 - y0);
  const dhx1 = 0;
  const dhy1 =  2 * (y1 - y0);

  output[0] = 2 * h * dhx0;
  output[1] = 2 * h * dhy0;
  output[2] = 2 * h * dhx1;
  output[3] = 2 * h * dhy1;
  return output;
};