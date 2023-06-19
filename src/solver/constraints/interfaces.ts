export type IndexValueMap = { [key: string]: number };

export interface SolverConstraint {
  f(map: IndexValueMap, x: number[]): number;
  // Returns g.
  g(map: IndexValueMap, x: number[], g: number[]): number[];
  getIndexes(): string[];
  getValueFromIndex(index: string): number;
  setValueAtIndex(index: string, value: number): void;
}