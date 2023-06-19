import VError from 'verror';

import { IndexValueMap, SolverConstraint } from './constraints/interfaces';
import { SolverLBFGS } from './optim/lbfgs';

export class ConstraintSystem {
  private _constraints: SolverConstraint[];
  private _tmpX: number[];
  private _tmpGrad: number[];
  private _indexValueMap: IndexValueMap;

  constructor() {
    this._constraints = [];
    this._tmpX = [];
    this._tmpGrad = [];
    this._indexValueMap = {};
  }

  public addConstraint(constraint: SolverConstraint): void {
    this._constraints.push(constraint);
  }

  public objectiveFunc = (x: number[]): number => {
    let result = 0;
    for (const constraint of this._constraints) {
      result += constraint.f(this._indexValueMap, x);
    }
    return result;
  }

  public objectiveGrad = (x: number[]): number[] => {
    // reset gradient array
    for (let i = 0; i < x.length; i++) {
      this._tmpGrad[i] = 0;
    }

    // construct gradient
    for (const constraint of this._constraints) {
      constraint.g(this._indexValueMap, x, this._tmpGrad);
    }
    return this._tmpGrad;
  }

  public async solve(): Promise<any> {
    // construct index hash map and value array
    let globalPosition = 0;
    const x = this._tmpX;
    const indexValueMap: { [key: string]: number } = {};

    // initialize optimization problem
    for (const constraint of this._constraints) {
      const indexes = constraint.getIndexes();
      for (const index of indexes) {
        // load unique indexes into array
        if (indexValueMap[index] === undefined) {
          indexValueMap[index] = globalPosition;
          x[globalPosition] = constraint.getValueFromIndex(index);
          globalPosition++;
        }        
      }
    }
    this._indexValueMap = indexValueMap;

    const solver = new SolverLBFGS(globalPosition, 4);
    const result = await solver.solve(x, this.objectiveFunc, this.objectiveGrad);
    if (result.success) {
      // load values into solver entities
      for (const constraint of this._constraints) {
        const cIndexes = constraint.getIndexes();
        for (const index of cIndexes) {
          const arrPos = indexValueMap[index];
          const value = x[arrPos];
          if (value === undefined) {
            throw new VError('Missing value for index %s', index);
          }
          constraint.setValueAtIndex(index, value);
        }
      }
    }
    
    // return result
    return result.success;
  }
}