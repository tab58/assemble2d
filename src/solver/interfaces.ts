export interface SolverResult {
  points: {
    id: string;
    x: number;
    y: number;
  }[];
}

export interface SolverInfo {
  points: {
    id: string;
    x: number;
    y: number;
  }[];
  constraints: ConstraintInfo[];
}

type ConstraintInfo = | 
  CoincidentInfo |
  ConcentricInfo;

export interface CoincidentInfo {
  type: ConstraintType.COINCIDENT;
  p0: string;
  p1: string;
}

export interface ConcentricInfo {
  type: ConstraintType.CONCENTRIC;
  c0: string;
  c1: string;
}