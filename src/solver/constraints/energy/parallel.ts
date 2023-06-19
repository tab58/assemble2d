/**
 * See Eberly, Robust and Error-free Geometric Computing (2020), page 23.
 */
export const parallelEnergyFunc = (x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number => {
  let dx10 = x1 - x0;
  let dy10 = y1 - y0;
  let dx32 = x3 - x2;
  let dy32 = y3 - y2;
  let f = dx10 * dx10 * dy32 * dy32 
    - 2 * dx10 * dx32 * dy10 * dy32
    + dx32 * dx32 * dy10 * dy10;
  return f;
};

export const parallelEnergyGrad = (x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, output: number[]): number[] => {
  let dx10 = x1 - x0;
  let dy10 = y1 - y0;
  let dx32 = x3 - x2;
  let dy32 = y3 - y2;
  
  const dfx0 = 2 * (-dx10 * dy32 * dy32 + dx32 * dy10 * dy32);
  const dfy0 = 2 * ( dx10 * dx32 * dy32 - dy10 * dx32 * dx32);
  const dfx1 = 2 * ( dx10 * dy32 * dy32 - dx32 * dy10 * dy32);
  const dfy1 = 2 * (-dx10 * dx32 * dy32 + dy10 * dx32 * dx32);
  const dfx2 = 2 * ( dx10 * dy10 * dy32 - dx32 * dy10 * dy10);
  const dfy2 = 2 * (-dy32 * dx10 * dx10 + dx10 * dx32 * dy10);
  const dfx3 = 2 * (-dx10 * dy10 * dy32 + dx32 * dy10 * dy10);
  const dfy3 = 2 * ( dy32 * dx10 * dx10 - dx10 * dx32 * dy10);

  output[0] = dfx0;
  output[1] = dfy0;
  output[2] = dfx1;
  output[3] = dfy1;
  output[4] = dfx2;
  output[5] = dfy2;
  output[6] = dfx3;
  output[7] = dfy3;
  return output;
};