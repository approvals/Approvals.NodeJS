import { verify } from "./JestApprovals";
import { printCombinations, EMPTY } from "../../Utilities/Printers";

type Printer<T extends any[]> = (...args: T) => any;
type ParameterLists<T extends any[]> = { [K in keyof T]: T[K][] };

function verifyAllCombinations<T extends any[]>(
  func: Printer<T>,
  ...params: ParameterLists<T>
) {
  const paddedParams = [...params];

  while (paddedParams.length < 9) {
    paddedParams.push(EMPTY);
  }

  const combiner = (...args: any[]) =>
    func(...(args.slice(0, params.length) as T));

  // @ts-ignore
  verify(printCombinations(combiner, ...paddedParams));
}

export function verifyAllCombinations1<T1>(
  func: (t1: T1) => any,
  params1: T1[],
) {
  verifyAllCombinations(func, params1);
}

export function verifyAllCombinations2<T1, T2>(
  func: (t1: T1, t2: T2) => any,
  params1: T1[],
  params2: T2[],
) {
  verifyAllCombinations(func, params1, params2);
}

export function verifyAllCombinations3<T1, T2, T3>(
  func: (t1: T1, t2: T2, t3: T3) => any,
  params1: T1[],
  params2: T2[],
  params3: T3[],
) {
  verifyAllCombinations(func, params1, params2, params3);
}

export function verifyAllCombinations4<T1, T2, T3, T4>(
  func: (t1: T1, t2: T2, t3: T3, t4: T4) => any,
  params1: T1[],
  params2: T2[],
  params3: T3[],
  params4: T4[],
) {
  verifyAllCombinations(func, params1, params2, params3, params4);
}

export function verifyAllCombinations5<T1, T2, T3, T4, T5>(
  func: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => any,
  params1: T1[],
  params2: T2[],
  params3: T3[],
  params4: T4[],
  params5: T5[],
) {
  verifyAllCombinations(func, params1, params2, params3, params4, params5);
}

export function verifyAllCombinations6<T1, T2, T3, T4, T5, T6>(
  func: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6) => any,
  params1: T1[],
  params2: T2[],
  params3: T3[],
  params4: T4[],
  params5: T5[],
  params6: T6[],
) {
  verifyAllCombinations(
    func,
    params1,
    params2,
    params3,
    params4,
    params5,
    params6,
  );
}

export function verifyAllCombinations7<T1, T2, T3, T4, T5, T6, T7>(
  func: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7) => any,
  params1: T1[],
  params2: T2[],
  params3: T3[],
  params4: T4[],
  params5: T5[],
  params6: T6[],
  params7: T7[],
) {
  verifyAllCombinations(
    func,
    params1,
    params2,
    params3,
    params4,
    params5,
    params6,
    params7,
  );
}

export function verifyAllCombinations8<T1, T2, T3, T4, T5, T6, T7, T8>(
  func: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8) => any,
  params1: T1[],
  params2: T2[],
  params3: T3[],
  params4: T4[],
  params5: T5[],
  params6: T6[],
  params7: T7[],
  params8: T8[],
) {
  verifyAllCombinations(
    func,
    params1,
    params2,
    params3,
    params4,
    params5,
    params6,
    params7,
    params8,
  );
}

export function verifyAllCombinations9<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  func: (
    t1: T1,
    t2: T2,
    t3: T3,
    t4: T4,
    t5: T5,
    t6: T6,
    t7: T7,
    t8: T8,
    t9: T9,
  ) => any,
  params1: T1[],
  params2: T2[],
  params3: T3[],
  params4: T4[],
  params5: T5[],
  params6: T6[],
  params7: T7[],
  params8: T8[],
  params9: T9[],
) {
  verifyAllCombinations(
    func,
    params1,
    params2,
    params3,
    params4,
    params5,
    params6,
    params7,
    params8,
    params9,
  );
}
