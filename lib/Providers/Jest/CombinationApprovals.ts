import { verify } from "./JestApprovals";
import { printCombinations, EMPTY } from "../../Utilities/Printers";

export function verifyAllCombinations1<T1>(
  func: (i: T1) => any,
  params1: T1[],
) {
  // @ts-ignore
  verify(
    printCombinations(
      (t1, t2, t3, t4, t5, t6, t7, t8, t9) => func(t1),
      params1,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
    ),
  );
}

export function verifyAllCombinations2<T1, T2>(
  func: (t1: T1, t2: T2) => any,
  params1: T1[],
  params2: T2[],
) {
  // @ts-ignore
  verify(
    printCombinations(
      (
        t1: T1,
        t2: T2,
        t3: any,
        t4: any,
        t5: any,
        t6: any,
        t7: any,
        t8: any,
        t9: any,
      ) => func(t1, t2),
      params1,
      params2,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
    ),
  );
}

export function verifyAllCombinations3<T1, T2, T3>(
  func: (t1: T1, t2: T2, t3: T3) => any,
  params1: T1[],
  params2: T2[],
  params3: T3[],
) {
  // @ts-ignore
  verify(
    printCombinations(
      (
        t1: T1,
        t2: T2,
        t3: T3,
        t4: any,
        t5: any,
        t6: any,
        t7: any,
        t8: any,
        t9: any,
      ) => func(t1, t2, t3),
      params1,
      params2,
      params3,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
    ),
  );
}

export function verifyAllCombinations4<T1, T2, T3, T4>(
  func: (t1: T1, t2: T2, t3: T3, t4: T4) => any,
  params1: T1[],
  params2: T2[],
  params3: T3[],
  params4: T4[],
) {
  // @ts-ignore
  verify(
    printCombinations(
      (
        t1: T1,
        t2: T2,
        t3: T3,
        t4: T4,
        t5: any,
        t6: any,
        t7: any,
        t8: any,
        t9: any,
      ) => func(t1, t2, t3, t4),
      params1,
      params2,
      params3,
      params4,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
    ),
  );
}

export function verifyAllCombinations5<T1, T2, T3, T4, T5>(
  func: (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => any,
  params1: T1[],
  params2: T2[],
  params3: T3[],
  params4: T4[],
  params5: T5[],
) {
  // @ts-ignore
  verify(
    printCombinations(
      (
        t1: T1,
        t2: T2,
        t3: T3,
        t4: T4,
        t5: T5,
        t6: any,
        t7: any,
        t8: any,
        t9: any,
      ) => func(t1, t2, t3, t4, t5),
      params1,
      params2,
      params3,
      params4,
      params5,
      EMPTY,
      EMPTY,
      EMPTY,
      EMPTY,
    ),
  );
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
  // @ts-ignore
  verify(
    printCombinations(
      (
        t1: T1,
        t2: T2,
        t3: T3,
        t4: T4,
        t5: T5,
        t6: T6,
        t7: any,
        t8: any,
        t9: any,
      ) => func(t1, t2, t3, t4, t5, t6),
      params1,
      params2,
      params3,
      params4,
      params5,
      params6,
      EMPTY,
      EMPTY,
      EMPTY,
    ),
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
  // @ts-ignore
  verify(
    printCombinations(
      (
        t1: T1,
        t2: T2,
        t3: T3,
        t4: T4,
        t5: T5,
        t6: T6,
        t7: T7,
        t8: any,
        t9: any,
      ) => func(t1, t2, t3, t4, t5, t6, t7),
      params1,
      params2,
      params3,
      params4,
      params5,
      params6,
      params7,
      EMPTY,
      EMPTY,
    ),
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
  // @ts-ignore
  verify(
    printCombinations(
      (
        t1: T1,
        t2: T2,
        t3: T3,
        t4: T4,
        t5: T5,
        t6: T6,
        t7: T7,
        t8: T8,
        t9: any,
      ) => func(t1, t2, t3, t4, t5, t6, t7, t8),
      params1,
      params2,
      params3,
      params4,
      params5,
      params6,
      params7,
      params8,
      EMPTY,
    ),
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
  // @ts-ignore
  verify(
    printCombinations(
      (
        t1: T1,
        t2: T2,
        t3: T3,
        t4: T4,
        t5: T5,
        t6: T6,
        t7: T7,
        t8: T8,
        t9: T9,
      ) => func(t1, t2, t3, t4, t5, t6, t7, t8, t9),
      params1,
      params2,
      params3,
      params4,
      params5,
      params6,
      params7,
      params8,
      params9,
    ),
  );
}
