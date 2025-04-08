export function printArray<T>(
  header: string,
  list: T[],
  formatter?: (element: T) => string,
): string {
  function getDefaultFormatter() {
    let count = 0;
    return (t: T): string => `[${count++}] => ${t}`;
  }

  formatter = formatter || getDefaultFormatter();
  let text = "";
  if (header) {
    text = header + "\n\n\n";
  }
  for (let t of list) {
    text += formatter(t) + "\n";
  }
  return text;
}

export function printJson(data: any) {
  return JSON.stringify(data, null, "  ");
}

const EMPTY_ENTRY = {};
export const EMPTY = [EMPTY_ENTRY];

type Printer<T> = (...args: T[]) => any;
type PrinterArgs<T> = T[];

export function printCombinations<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
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
): string {
  const combinations = generateCombinations(
    [
      params1,
      params2,
      params3,
      params4,
      params5,
      params6,
      params7,
      params8,
      params9,
    ] as any,
    [],
  );

  let text = "";
  combinations.forEach(
    (combination) =>
      (text += handleParameterCombination(func as any, combination)),
  );

  return text;
}

function generateCombinations<T extends any[]>(
  params: PrinterArgs<T>[],
  combinations: PrinterArgs<T>[],
  index: number = 0,
  currentCombination: PrinterArgs<T> = [],
): PrinterArgs<T>[] {
  const allParametersProcessed = index === params.length;
  if (allParametersProcessed) {
    combinations.push(currentCombination);
    return combinations;
  }

  for (let p of params[index]) {
    generateCombinations(params, combinations, index + 1, [
      ...currentCombination,
      p,
    ]);
  }

  return combinations;
}

function handleParameterCombination<T>(func: Printer<T>, args: PrinterArgs<T>) {
  let output;
  try {
    output = func(...args);
  } catch (e) {
    output = `${e}`;
  }
  const parameters = args.filter((p) => p !== EMPTY_ENTRY);

  return `[${parameters}] => ${output}\n`;
}
