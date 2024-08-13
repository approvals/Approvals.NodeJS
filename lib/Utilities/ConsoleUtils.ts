import { gray, green, red, yellow } from "ansi-colors";

export function yellowText(text: string): string {
  return yellow(text);
}

export function redText(text: string): string {
  return red(text);
}
export function greenText(text: string): string {
  return green(text);
}
export function grayText(text: string): string {
  return gray(text);
}
