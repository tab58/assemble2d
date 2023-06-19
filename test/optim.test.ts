import { SolverLBFGS } from '../src/solver/optim';

describe('optimization', () => {
  test('should be able to optimize', async () => {
    const a = 1;
    const b = 10;

    // Rosenbrock function
    const f = (values: number[]) => {
      const [x, y] = values;
      return x * Math.exp(-x * x - y * y) + (x * x + y * y) / 20.0;
    };
    const df = (values: number[], output: number[]): number[] => {
      const [x, y] = values;
      const df1_1 = Math.exp(-(x * x + y * y)) / 10;
      const df1_2 = x * Math.exp(x * x + y * y) - 20 * x * x + 10;

      const df1 = df1_1 * df1_2;
      const df2 = y * (0.1 - 2 * x * Math.exp(-(x * x + y * y)));

      output[0] = df1;
      output[1] = df2;
      return output;
    };

    const solver = new SolverLBFGS(2, 3);
    const values = [-2, 2];
    const result = await solver.solve(values, f, df);
    console.log(result);
    expect(result).toBe(true);
    
    const [v0, v1] = values;
    const fxmin_calc = f(values);
    const minimum = [-0.6691, 0];
    const fxmin_solve = f(minimum);
    expect(Math.abs(v0 - minimum[0])).toBeLessThan(1e-4);
    expect(Math.abs(v1 - minimum[1])).toBeLessThan(1e-4);
  });
})