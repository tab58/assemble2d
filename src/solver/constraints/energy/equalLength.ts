export const equalLengthEnergyFunc = (x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) => {
  const u1 = x1 - x0;
  const v1 = y1 - y0;
  const u2 = x3 - x2;
  const v2 = y3 - y2;
  const h = u1 * u1 + v1 * v1 - u2 * u2 - v2 * v2;
  return h * h;
};

export const equalLengthEnergyGrad = (x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, output: number[]): number[] => {
  const u1 = x1 - x0;
  const v1 = y1 - y0;
  const u2 = x3 - x2;
  const v2 = y3 - y2;
  const h = u1 * u1 + v1 * v1 - u2 * u2 - v2 * v2;
  
  const dhx0 = -2 * u1;
  const dhy0 = -2 * v1;
  const dhx1 = 2 * u1;
  const dhy1 = 2 * v1;
  const dhx2 = 2 * u2;
  const dhy2 = 2 * v2;
  const dhx3 = -2 * u2;
  const dhy3 = -2 * v2;

  output[0] = 2 * h * dhx0;
  output[1] = 2 * h * dhy0;
  output[2] = 2 * h * dhx1;
  output[3] = 2 * h * dhy1;
  output[4] = 2 * h * dhx2;
  output[5] = 2 * h * dhy2;
  output[6] = 2 * h * dhx3;
  output[7] = 2 * h * dhy3;
  return output;
};