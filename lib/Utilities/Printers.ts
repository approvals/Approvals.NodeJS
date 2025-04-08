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

export function printCombinations<T>(
  func: Printer<T>,
  ...args: PrinterArgs<T>
): string {
  const combinations = generateCombinations([...args] as any, []);

  let text = "";
  combinations.forEach((combination) => {
    text += handleParameterCombination(func, combination as PrinterArgs<T>);
  });

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
