import {
  ParameterLists,
  Printer,
} from "../Providers/Jest/CombinationApprovals";

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

export function printCombinations<T extends any[]>(
  func: Printer<T>,
  ...args: ParameterLists<T>
): string {
  const combinations: T[] = generateCombinations(args, [], 0, []) as T[];

  let text = "";
  combinations.forEach((combination) => {
    text += handleParameterCombination(func, combination);
  });

  return text;
}

function generateCombinations<T extends any[]>(
  params: T[],
  combinations: T[],
  index: number,
  currentCombination: T,
): T[] {
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

function handleParameterCombination<T extends any[]>(
  func: Printer<T>,
  args: T,
) {
  let output;
  try {
    output = func(...args);
  } catch (e) {
    output = `${e}`;
  }
  return `[${args}] => ${output}\n`;
}
