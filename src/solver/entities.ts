import { v4 as uuidv4 } from 'uuid';
import { VError } from 'verror';

export interface SolverEntity {
  // must return entities in a deterministic way
  // getIndexes(): string[];
  // hasIndex(index: string): boolean;
  // getValueFromIndex(index: string): Promise<number>;
}

export class SolverScalar implements SolverEntity {
  private _value: number;
  private _index: string;

  constructor(value: number) {
    this._value = value;
    this._index = uuidv4();
  }

  public get index(): string {
    return this._index;
  }

  public get value(): number {
    return this._value;
  }

  public set value(value: number) {
    this._value = value;
  }
}

export class SolverPoint {
  private _x: SolverScalar;
  private _y: SolverScalar;

  constructor(x: number, y: number) {
    this._x = new SolverScalar(x);
    this._y = new SolverScalar(y);
  }

  public set(x: number, y: number) {
    this._x.value = x;
    this._y.value = y;
  }

  public setX(x: number) {
    this._x.value = x;
  }

  public setY(y: number) {
    this._y.value = y;
  }

  public get x(): number {
    return this._x.value;
  }

  public get y(): number {
    return this._y.value;
  }

  public get xIndex(): string {
    return this._x.index;
  }

  public get yIndex(): string {
    return this._y.index;
  }
}

export class SolverLine implements SolverEntity {
  public _p0: SolverPoint;
  public _p1: SolverPoint;

  constructor() {
    this._p0 = new SolverPoint(0, 0);
    this._p1 = new SolverPoint(0, 0);
  }

  public get p0(): SolverPoint {
    return this._p0;
  }

  public get p1(): SolverPoint {
    return this._p1;
  }

  public get p0x(): number {
    return this._p0.x;
  }

  public get p0y(): number {
    return this._p0.y;
  }

  public get p1x(): number {
    return this._p1.x;
  }

  public get p1y(): number {
    return this._p1.y;
  }

  public get p0xIndex(): string {
    return this._p0.xIndex;
  }

  public get p0yIndex(): string {
    return this._p0.yIndex;
  }

  public get p1xIndex(): string {
    return this._p1.xIndex;
  }

  public get p1yIndex(): string {
    return this._p1.yIndex;
  }

  public setP0x(x: number) {
    this._p0.setX(x);
  }

  public setP0y(y: number) {
    this._p0.setY(y);
  }

  public setP1x(x: number) {
    this._p1.setX(x);
  }

  public setP1y(y: number) {
    this._p1.setY(y);
  }
}

export class SolverCircle implements SolverEntity {
  public _center: SolverPoint;
  public _radius: SolverScalar;

  constructor() {
    this._center = new SolverPoint(0, 0);
    this._radius = new SolverScalar(0);
  }

  public get center(): SolverPoint {
    return this._center;
  }

  public get radius(): number {
    return this._radius.value;
  }

  public get centerX(): number {
    return this._center.x;
  }

  public get centerY(): number {
    return this._center.y;
  }

  public get radiusIndex(): string {
    return this._radius.index;
  }

  public setCenterX(x: number) {
    this._center.setX(x);
  }

  public setCenterY(y: number) {
    this._center.setY(y);
  }

  public setRadius(radius: number) {
    this._radius.value = radius;
  }
}