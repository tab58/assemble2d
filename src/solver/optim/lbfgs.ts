import { VectorN } from "./nvector";

interface LBFGSSolverOptions {
  maxIterations?: number;
  tolerance?: number;
}

interface LBFGSSolverResult {
  success: boolean;
  iterations: number;
  objectiveValue: number;
  relativeDifference: number;
}

export class SolverLBFGS {
  private _size: number;
  private _steps: number;

  private _y: number[][];
  private _s: number[][];
  private _rho: number[];

  private _tmp: number[];

  public constructor(n: number, steps: number) {
    const M = Math.floor(steps);
    const N = Math.floor(n);
    
    // initialize data storage
    this._y = [];
    this._s = [];
    for (let i = 0; i < M; i++) {
      this._y[i] = VectorN.new(N);
      this._s[i] = VectorN.new(N);
    }
    this._rho = VectorN.new(N);

    // initialize temporary storage
    this._tmp = VectorN.new(N);

    // save parameters
    this._steps = M;
    this._size = N;
  }

  /**
   * Uses L-BFGS update described in Nocedal, 1980.
   * @param k The iteration number.
   * @param g The gradient at the current point.
   * @param x The current point.
   * @param d Modifies this vector in place.
   * @returns d.
   */
  private _updateDirection(k: number, g: number[], x: number[], d: number[]): number[] {
    const m = this._steps;
    const iter = Math.floor(k);
    const incr = (iter <= m) ? 0 : (iter - m);
    const bound = (iter <= m) ? iter : m;

    const q = d;
    VectorN.copy(q, g); // q_bound = g_iter

    // compute latest s_k and y_k
    if (iter > 0) {
      const jj = (iter - 1) % m; // idx for s and y, this will be fetched this iteration
      const jj1 = iter % m; // idx for x and g; this will be stored for next iteration

      // assume x_k and g_k are already stored; calculate s_k and y_k
      VectorN.scaleAndAdd(x, -1.0, this._s[jj], this._s[jj]);
      VectorN.scaleAndAdd(g, -1.0, this._y[jj], this._y[jj]);

      // store x_k+1 and g_k+1 for later
      VectorN.copy(this._s[jj1], x);
      VectorN.copy(this._y[jj1], g);

      // compute rho_k
      this._rho[jj] = 1.0 / VectorN.dot(this._s[jj], this._y[jj]);
    }
    
    const alpha = VectorN.new(bound);
    for (let i = bound - 1; i >= 0; i--) {
      const j = i + incr;
      const sj = this._s[j % m];
      const pj = this._rho[j % m];
      const yj = this._y[j % m];
      alpha[i] = pj * VectorN.dot(sj, q);
      VectorN.scaleAndAdd(q, -alpha[i], yj, q);
    }
    // r0 = H0 * q0; H0 = I
    for (let i = 0; i < bound; i++) {
      const j = i + incr;
      const yj = this._y[j % m];
      const pj = this._rho[j % m];
      const sj = this._s[j % m];
      const beta_i = pj * VectorN.dot(yj, q); // beta_i = p_j * y_j^T * r_i
      VectorN.scaleAndAdd(q, alpha[i] - beta_i, sj, q); // r_i+1 = r_i + (alpha_i - beta_i) * s_j
    }
    // d_iter = r_bound = q
    VectorN.scale(-1.0, d, d);
    return d;
  }

  private _backtrackingArmijoLineSearch(x0: number[], f: (values: number[]) => number, g: number[], d: number[]): number {
    const alpha = 0.25;
    const beta = 0.5;
    let t = 1.0;

    const x = this._tmp;
    VectorN.scaleAndAdd(x0, t, d, x);
    let lhs = f(x);
    let rhs = f(x0) + alpha * t * VectorN.dot(g, d);
    while (lhs > rhs) {
      t *= beta;
      VectorN.scaleAndAdd(x0, t, d, x);
      lhs = f(x);
      rhs = f(x0) + alpha * t * VectorN.dot(g, d);
    }
    return t;
  }

  // Solves the unconstrained optimization problem using L-BFGS.
  public async solve(values: number[], f: (values: number[]) => number, df: (values: number[]) => number[], options?: LBFGSSolverOptions): Promise<LBFGSSolverResult> {
    let {
      maxIterations,
      tolerance
    } = options || {};

    const MAX_ITER = maxIterations || 1000;
    const TOL = tolerance || 1e-10;
        
    let k = 0;
    let n = values.length;
    const x = VectorN.new(n);
    VectorN.copy(x, values);
    // const g = VectorN.new(n);
    // df(x, g);
    let g = df(x);

    // initialize direction vector
    let d = VectorN.new(values.length);

    // initialize x0 and g0 for updates
    VectorN.copy(this._s[0], x);
    VectorN.copy(this._y[0], g);

    const iter = 0;
    let fx0 = f(x);
    let fx1 = Number.MAX_SAFE_INTEGER;
    while (iter < MAX_ITER) {
      d = this._updateDirection(k, g, x, d);
      const a = this._backtrackingArmijoLineSearch(x, f, g, d);
      VectorN.scaleAndAdd(x, a, d, x); // x1 = x0 + a * d
      fx1 = f(x);
      g = df(x);
      if (Math.abs(fx1 - fx0) < TOL) {
        VectorN.copy(values, x);
        return {
          success: true,
          iterations: iter,
          objectiveValue: fx1,
          relativeDifference: Math.abs(fx1 - fx0),
        };
      }
      // reset loop
      k++;
      fx0 = fx1;
    }
    return {
      success: false,
      iterations: iter,
      objectiveValue: fx1,
      relativeDifference: Math.abs(fx1 - fx0),
    };
  }
}