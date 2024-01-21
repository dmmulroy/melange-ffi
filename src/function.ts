interface CurriedFunctionWithArity1<T1, R> {
  (): CurriedFunctionWithArity1<T1, R>;
  (t1: T1): R;
}
interface CurriedFunctionWithArity2<T1, T2, R> {
  (): CurriedFunctionWithArity2<T1, T2, R>;
  (t1: T1): CurriedFunctionWithArity1<T2, R>;
  (t1: T1, t2: T2): CurriedFunctionWithArity1<T1, R>;
  (t1: T1, t2: T2): R;
}
interface CurriedFunctionWithArity3<T1, T2, T3, R> {
  (): CurriedFunctionWithArity3<T1, T2, T3, R>;
  (t1: T1): CurriedFunctionWithArity2<T2, T3, R>;
  (t1: never, t2: T2): CurriedFunctionWithArity2<T1, T3, R>;
  (t1: T1, t2: T2): CurriedFunctionWithArity1<T3, R>;
  (t1: never, t2: never, t3: T3): CurriedFunctionWithArity2<T1, T2, R>;
  (t1: T1, t2: never, t3: T3): CurriedFunctionWithArity1<T2, R>;
  (t1: never, t2: T2, t3: T3): CurriedFunctionWithArity1<T1, R>;
  (t1: T1, t2: T2, t3: T3): R;
}
interface CurriedFunctionWithArity4<T1, T2, T3, T4, R> {
  (): CurriedFunctionWithArity4<T1, T2, T3, T4, R>;
  (t1: T1): CurriedFunctionWithArity3<T2, T3, T4, R>;
  (t1: never, t2: T2): CurriedFunctionWithArity3<T1, T3, T4, R>;
  (t1: T1, t2: T2): CurriedFunctionWithArity2<T3, T4, R>;
  (t1: never, t2: never, t3: T3): CurriedFunctionWithArity3<T1, T2, T4, R>;
  (t1: never, t2: never, t3: T3): CurriedFunctionWithArity2<T2, T4, R>;
  (t1: never, t2: T2, t3: T3): CurriedFunctionWithArity2<T1, T4, R>;
  (t1: T1, t2: T2, t3: T3): CurriedFunctionWithArity1<T4, R>;
  (
    t1: never,
    t2: never,
    t3: never,
    t4: T4,
  ): CurriedFunctionWithArity3<T1, T2, T3, R>;
  (t1: T1, t2: never, t3: never, t4: T4): CurriedFunctionWithArity2<T2, T3, R>;
  (t1: never, t2: T2, t3: never, t4: T4): CurriedFunctionWithArity2<T1, T3, R>;
  (t1: never, t2: never, t3: T3, t4: T4): CurriedFunctionWithArity2<T1, T2, R>;
  (t1: T1, t2: T2, t3: never, t4: T4): CurriedFunctionWithArity1<T3, R>;
  (t1: T1, t2: never, t3: T3, t4: T4): CurriedFunctionWithArity1<T2, R>;
  (t1: never, t2: T2, t3: T3, t4: T4): CurriedFunctionWithArity1<T1, R>;
  (t1: T1, t2: T2, t3: T3, t4: T4): R;
}
interface CurriedFunctionWithArity5<T1, T2, T3, T4, T5, R> {
  (): CurriedFunctionWithArity5<T1, T2, T3, T4, T5, R>;
  (t1: T1): CurriedFunctionWithArity4<T2, T3, T4, T5, R>;
  (t1: never, t2: T2): CurriedFunctionWithArity4<T1, T3, T4, T5, R>;
  (t1: T1, t2: T2): CurriedFunctionWithArity3<T3, T4, T5, R>;
  (t1: never, t2: never, t3: T3): CurriedFunctionWithArity4<T1, T2, T4, T5, R>;
  (t1: T1, t2: never, t3: T3): CurriedFunctionWithArity3<T2, T4, T5, R>;
  (t1: never, t2: T2, t3: T3): CurriedFunctionWithArity3<T1, T4, T5, R>;
  (t1: T1, t2: T2, t3: T3): CurriedFunctionWithArity2<T4, T5, R>;
  (
    t1: never,
    t2: never,
    t3: never,
    t4: T4,
  ): CurriedFunctionWithArity4<T1, T2, T3, T5, R>;
  (
    t1: T1,
    t2: never,
    t3: never,
    t4: T4,
  ): CurriedFunctionWithArity3<T2, T3, T5, R>;
  (
    t1: never,
    t2: T2,
    t3: never,
    t4: T4,
  ): CurriedFunctionWithArity3<T1, T3, T5, R>;
  (
    t1: never,
    t2: never,
    t3: T3,
    t4: T4,
  ): CurriedFunctionWithArity3<T1, T2, T5, R>;
  (t1: T1, t2: T2, t3: never, t4: T4): CurriedFunctionWithArity2<T3, T5, R>;
  (t1: T1, t2: never, t3: T3, t4: T4): CurriedFunctionWithArity2<T2, T5, R>;
  (t1: never, t2: T2, t3: T3, t4: T4): CurriedFunctionWithArity2<T1, T5, R>;
  (t1: T1, t2: T2, t3: T3, t4: T4): CurriedFunctionWithArity1<T5, R>;
  (
    t1: never,
    t2: never,
    t3: never,
    t4: never,
    t5: T5,
  ): CurriedFunctionWithArity4<T1, T2, T3, T4, R>;
  (
    t1: T1,
    t2: never,
    t3: never,
    t4: never,
    t5: T5,
  ): CurriedFunctionWithArity3<T2, T3, T4, R>;
  (
    t1: never,
    t2: T2,
    t3: never,
    t4: never,
    t5: T5,
  ): CurriedFunctionWithArity3<T1, T3, T4, R>;
  (
    t1: never,
    t2: never,
    t3: T3,
    t4: never,
    t5: T5,
  ): CurriedFunctionWithArity3<T1, T2, T4, R>;
  (
    t1: never,
    t2: never,
    t3: never,
    t4: T4,
    t5: T5,
  ): CurriedFunctionWithArity3<T1, T2, T3, R>;
  (
    t1: T1,
    t2: T2,
    t3: never,
    t4: never,
    t5: T5,
  ): CurriedFunctionWithArity2<T3, T4, R>;
  (
    t1: T1,
    t2: never,
    t3: T3,
    t4: never,
    t5: T5,
  ): CurriedFunctionWithArity2<T2, T4, R>;
  (
    t1: T1,
    t2: never,
    t3: never,
    t4: T4,
    t5: T5,
  ): CurriedFunctionWithArity2<T2, T3, R>;
  (
    t1: never,
    t2: T2,
    t3: T3,
    t4: never,
    t5: T5,
  ): CurriedFunctionWithArity2<T1, T4, R>;
  (
    t1: never,
    t2: T2,
    t3: never,
    t4: T4,
    t5: T5,
  ): CurriedFunctionWithArity2<T1, T3, R>;
  (
    t1: never,
    t2: never,
    t3: T3,
    t4: T4,
    t5: T5,
  ): CurriedFunctionWithArity2<T1, T2, R>;
  (t1: T1, t2: T2, t3: T3, t4: never, t5: T5): CurriedFunctionWithArity1<T4, R>;
  (t1: T1, t2: T2, t3: never, t4: T4, t5: T5): CurriedFunctionWithArity1<T3, R>;
  (t1: T1, t2: never, t3: T3, t4: T4, t5: T5): CurriedFunctionWithArity1<T2, R>;
  (t1: never, t2: T2, t3: T3, t4: T4, t5: T5): CurriedFunctionWithArity1<T1, R>;
  (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5): R;
}

interface Curry {
  <T1, R>(func: (t1: T1) => R): CurriedFunctionWithArity1<T1, R>;
  <T1, T2, R>(
    func: (t1: T1, t2: T2) => R,
  ): CurriedFunctionWithArity2<T1, T2, R>;
  <T1, T2, T3, R>(
    func: (t1: T1, t2: T2, t3: T3) => R,
  ): CurriedFunctionWithArity3<T1, T2, T3, R>;
  <T1, T2, T3, T4, R>(
    func: (t1: T1, t2: T2, t3: T3, t4: T4) => R,
  ): CurriedFunctionWithArity4<T1, T2, T3, T4, R>;
  <T1, T2, T3, T4, T5, R>(
    func: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => R,
  ): CurriedFunctionWithArity5<T1, T2, T3, T4, T5, R>;
  (func: (...args: unknown[]) => unknown): (...args: unknown[]) => unknown;
}

const curry: Curry = (fn: Function) => {
  const curried = (...args: unknown[]) => {
    if (args.length >= fn.length) {
      return fn.apply(undefined, args);
    } else {
      return (...args2: ConcatArray<unknown>[]) =>
        curried.apply(undefined, args.concat(args2));
    }
  };
  return curried;
};
