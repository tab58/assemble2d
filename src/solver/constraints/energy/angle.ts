export const angleEnergyFunc = (x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, theta: number): number => {
  const u0 = x1 - x0;
  const v0 = y1 - y0;
  const u1 = x3 - x2;
  const v1 = y3 - y2;

  const lenU = Math.sqrt(u0 * u0 + v0 * v0);
  const lenV = Math.sqrt(u1 * u1 + v1 * v1);

  const dot = (u0 * u1 + v0 * v1) / (lenU * lenV);
  const angle = Math.acos(dot) - theta;
  return angle * angle;
}

export const angleEnergyGrad = (x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, theta: number, output: number[]): number[] => {
  const ux = x1 - x0;
  const uy = y1 - y0;
  const vx = x3 - x2;
  const vy = y3 - y2;
  
  const w = ux * vy - uy * vx; // |u x v|
  const z = ux * vx + uy * vy; // u . v

  if (w === 0 && z === 0) {
    // this should only happen when some of the points are coincident
    // TODO: should this be allowed? maybe we should just return 0?
    output[0] = Number.MAX_VALUE;
    output[1] = Number.MAX_VALUE;
    output[2] = Number.MAX_VALUE;
    output[3] = Number.MAX_VALUE;
    output[4] = Number.MAX_VALUE;
    output[5] = Number.MAX_VALUE;
    output[6] = Number.MAX_VALUE;
    output[7] = Number.MAX_VALUE;
    return output;
  }

  // h = |u x v| / (u . v) = tan(v_angle)
  // f = [atan(h) - theta]^2
  // df/dx = 2 * [atan(h) - theta] * (1 / 1 + h^2) * dh/dx
  //       = 2 * [atan(h) - theta] * (z^2 / z^2 + w^2) * dh/dx

  const dwx0 = y2 - y3;
  const dwy0 = x3 - x2;
  const dwx1 = y3 - y2;
  const dwy1 = x2 - x3;
  const dwx2 = y1 - y0;
  const dwy2 = x0 - x1;
  const dwx3 = y0 - y1;
  const dwy3 = x1 - x0;

  const dzx0 = x2 - x3;
  const dzy0 = y2 - y3;
  const dzx1 = x3 - x2;
  const dzy1 = y3 - y2;
  const dzx2 = x0 - x1;
  const dzy2 = y0 - y1;
  const dzx3 = x1 - x0;
  const dzy3 = y1 - y0;

  const dhx0 = (z * dwx0 - w * dzx0) / (z * z);
  const dhy0 = (z * dwy0 - w * dzy0) / (z * z);
  const dhx1 = (z * dwx1 - w * dzx1) / (z * z);
  const dhy1 = (z * dwy1 - w * dzy1) / (z * z);
  const dhx2 = (z * dwx2 - w * dzx2) / (z * z);
  const dhy2 = (z * dwy2 - w * dzy2) / (z * z);
  const dhx3 = (z * dwx3 - w * dzx3) / (z * z);
  const dhy3 = (z * dwy3 - w * dzy3) / (z * z);  
  
  const t = 2 * (Math.atan2(z, w) - theta) * (z * z) / (z * z + w * w);

  output[0] = t * dhx0;
  output[1] = t * dhy0;
  output[2] = t * dhx1;
  output[3] = t * dhy1;
  output[4] = t * dhx2;
  output[5] = t * dhy2;
  output[6] = t * dhx3;
  output[7] = t * dhy3;
  return output;
};