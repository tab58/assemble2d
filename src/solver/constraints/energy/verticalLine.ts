export const verticalLineEnergyFunc = (x0: number, y0: number, x1: number, y1: number): number => {
  return (x0 - x1) * (x0 - x1);
};

export const verticalLineEnergyGrad = (x0: number, y0: number, x1: number, y1: number, output: number[]): number[] => {
  const dfx0 = 2 * (x0 - x1);
  const dfy0 = 0;
  const dfx1 = -2 * (x0 - x1);
  const dfy1 = 0;

  output[0] = dfx0;
  output[1] = dfy0;
  output[2] = dfx1;
  output[3] = dfy1;
  return output;
};