import chalk from "chalk";

export function yellowText(text: string): string {
  return chalk.yellow(text);
}

export function redText(text: string): string {
  return chalk.red(text);
}
export function greenText(text: string): string {
  return chalk.green(text);
}
export function grayText(text: string): string {
  return chalk.gray(text);
}
