export const horizontalLineEnergyFunc = (x0: number, y0: number, x1: number, y1: number): number => {
  return (y0 - y1) * (y0 - y1);
};

export const horizontalLineEnergyGrad = (x0: number, y0: number, x1: number, y1: number, output: number[]): number[] => {
  const dfx0 = 0;
  const dfy0 = 2 * (y0 - y1);
  const dfx1 = 0;
  const dfy1 = -2 * (y0 - y1);

  output[0] = dfx0;
  output[1] = dfy0;
  output[2] = dfx1;
  output[3] = dfy1;
  return output;
};