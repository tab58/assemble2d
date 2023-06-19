import VError from "verror";

import { SolverPoint } from "../entities";
import { coincidentEnergyFunc, coincidentEnergyGrad } from "./energy/coincident";
import { SolverConstraint, IndexValueMap } from "./interfaces";

export class CoincidentConstraint implements SolverConstraint {
  private _p0: SolverPoint;
  private _p1: SolverPoint;

  private _p0xIndex: string;
  private _p0yIndex: string;
  private _p1xIndex: string;
  private _p1yIndex: string;

  private _globalValues: number[];
  private _grad: number[];

  /**
   * Coincident constraint between two points.
   * @param p0 The first solver point.
   * @param p1 The second solver point.
   */
  public constructor(p0: SolverPoint, p1: SolverPoint) {
    this._p0 = p0;
    this._p1 = p1;
    this._grad = [0, 0, 0, 0];
    this._globalValues = [0, 0, 0, 0];

    this._p0xIndex = p0.xIndex;
    this._p0yIndex = p0.yIndex;
    this._p1xIndex = p1.xIndex;
    this._p1yIndex = p1.yIndex;
  }

  private _loadGlobalValuesIntoTemp(map: IndexValueMap, x: number[]) {
    const ipx = map[this._p0xIndex];
    const ipy = map[this._p0yIndex];
    const iqx = map[this._p1xIndex];
    const iqy = map[this._p1yIndex];
    if (!ipx || !ipy || !iqx || !iqy) {
      throw new VError('Missing index for coincident constraint');
    }
    const px = x[ipx];
    const py = x[ipy];
    const qx = x[iqx];
    const qy = x[iqy];
    if (px === undefined || py === undefined || qx === undefined || qy === undefined) {
      throw new VError('Missing value for coincident constraint');
    }
    this._globalValues[0] = px;
    this._globalValues[1] = py;
    this._globalValues[2] = qx;
    this._globalValues[3] = qy;
  }

  public getIndexes(): string[] {
    return [this._p0xIndex, this._p0yIndex, this._p1xIndex, this._p1yIndex];
  }

  public f(map: IndexValueMap, x: number[]): number {
    this._loadGlobalValuesIntoTemp(map, x);
    const [px, py, qx, qy] = this._globalValues;
    return coincidentEnergyFunc(px, py, qx, qy);
  }

  // Returns g.
  public g(map: IndexValueMap, x: number[], g: number[]): number[] {
    this._loadGlobalValuesIntoTemp(map, x);
    const [px, py, qx, qy] = this._globalValues;
    coincidentEnergyGrad(px, py, qx, qy, this._grad);
    const [gpx, gpy, gqx, gqy] = this._grad;
    const ipx = map[this._p0xIndex];
    const ipy = map[this._p0yIndex];
    const iqx = map[this._p1xIndex];
    const iqy = map[this._p1yIndex];
    g[ipx] += gpx;
    g[ipy] += gpy;
    g[iqx] += gqx;
    g[iqy] += gqy;
    return g;
  }

  public getValueFromIndex(index: string): number {
    if (index === this._p0xIndex) {
      return this._p0.x;
    } else if (index === this._p0yIndex) {
      return this._p0.y;
    } else if (index === this._p1xIndex) {
      return this._p1.x;
    } else if (index === this._p1yIndex) {
      return this._p1.y;
    } else {
      throw new VError(`Index ${index} not found in coincident constraint`);
    }
  }

  public setValueAtIndex(index: string, value: number) {
    if (index === this._p0xIndex) {
      this._p0.setX(value);
    } else if (index === this._p0yIndex) {
      this._p0.setY(value);
    } else if (index === this._p1xIndex) {
      this._p1.setX(value);
    } else if (index === this._p1yIndex) {
      this._p1.setY(value);
    } else {
      throw new VError(`Index ${index} not found in coincident constraint`);
    }
  }
}
