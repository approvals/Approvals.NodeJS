import {
  VariationsForEachParameter,
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
  ...variations: VariationsForEachParameter<T>
): string {
  const parameterCombinations = generateParameterCombinations(variations);

  let text = "";
  parameterCombinations.forEach((parameters) => {
    text += print(func, parameters);
  });

  return text;
}

function generateParameterCombinations<T extends any[]>(
  variations: VariationsForEachParameter<T>,
  parameterCombinations: T[] = [],
  index: number = 0,
  currentParameterCombination: T = [] as unknown as T,
): T[] {
  const allParametersProcessed = index === variations.length;
  if (allParametersProcessed) {
    parameterCombinations.push(currentParameterCombination);
    return parameterCombinations;
  }

  for (let nextParameter of variations[index]) {
    generateParameterCombinations(
      variations,
      parameterCombinations,
      index + 1,
      [...currentParameterCombination, nextParameter],
    );
  }

  return parameterCombinations;
}

function print<T extends any[]>(func: Printer<T>, parameters: T) {
  let output;
  try {
    output = func(...parameters);
  } catch (e) {
    output = `${e}`;
  }
  return `[${parameters}] => ${output}\n`;
}
