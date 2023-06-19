export const lineCircleTangentEnergyFunc = (x0: number, y0: number, x1: number, y1: number, cx: number, cy: number, r: number): number => {
  const a = (x1 - x0) * (y0 - cy) - (y1 - y0) * (x0 - cx);
  const b = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
  const f = (a * a) - (b * r * r);
  return f * f;
};

export const lineCircleTangentEnergyGrad = (x0: number, y0: number, x1: number, y1: number, cx: number, cy: number, r: number, output: number[]): number[] => {
  const a = cx;
  const b = cy;
  const c = x1 - x0;
  const d = y1 - y0;

  const f1 = c * (y0 - b) - d * (x0 - a);
  const f2 = c * c + d * d;
  const f = (f1 * f1) - (f2 * r * r);
  
  const dfx0 = 2 * f * (-2*a*d*d + 2*b*c*d - 2*c*d*y0 + 2*d*d*x0);
  const dfy0 = 2 * f * ( 2*a*c*d - 2*b*c*c + 2*c*c*y0 - 2*c*d*x0);
  const dfx1 = 2 * f * (-2*a*b*d + 2*b*c*c + 2*a*d*y0 + 2*b*d*x0 - 4*b*c*y0 - 2*c*r*r + 2*c*y0*y0 - 2*d*x0*y0);
  const dfy1 = 2 * f * ( 2*a*a*d - 2*a*b*c + 2*a*c*y0 + 2*b*c*x0 - 4*a*d*x0 - 2*d*r*r - 2*c*x0*y0 + 2*d*x0*x0);
  const dfcx = 2 * f * ( 2*a*d*d - 2*b*c*d + 2*c*d*y0 - 2*d*d*x0);
  const dfcy = 2 * f * (-2*a*c*d + 2*b*c*c - 2*c*c*y0 + 2*c*d*x0);
  const dfr  = 2 * f * (-2*c*c*r - 2*d*d*r);

  output[0] = dfx0;
  output[1] = dfy0;
  output[2] = dfx1;
  output[3] = dfy1;
  output[4] = dfcx;
  output[5] = dfcy;
  output[6] = dfr;
  return output;
};