export const radiusEnergyFunc = (x0: number, y0: number, r0: number, r: number): number => {
  return (r0 - r) * (r0 - r);
};

export const radiusEnergyGrad = (x0: number, y0: number, r0: number, r: number, output: number[]): number[] => {
  const dfx0 = 0;
  const dfy0 = 0;
  const dfr0 = 2 * (r0 - r);

  output[0] = dfx0;
  output[1] = dfy0;
  output[2] = dfr0;
  return output;
}