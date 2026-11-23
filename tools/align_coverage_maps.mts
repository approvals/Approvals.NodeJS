#!/usr/bin/env node
// usage: node tools/align_coverage_maps.mts <reference coverage-final.json> <coverage-final.json to rewrite>
//
// Vitest remaps Istanbul locations through source maps and drops end columns, so nyc merge treats its
// statements as different from mocha's and jest's. When a file has the same statements, functions and
// branches starting at the same places, copy the reference location maps so the counts merge.
import fs from "node:fs";

type Location = { start: { line: number; column: number | null } };
type FileCoverage = {
  statementMap: Record<string, Location>;
  fnMap: Record<string, { loc: Location }>;
  branchMap: Record<string, { loc: Location; locations: Location[] }>;
};
type Coverage = Record<string, FileCoverage>;

const startsOf = (locations: Location[]) =>
  JSON.stringify(locations.map((location) => location.start));

const shapeOf = (file: FileCoverage) =>
  [
    startsOf(Object.values(file.statementMap)),
    startsOf(Object.values(file.fnMap).map((fn) => fn.loc)),
    JSON.stringify(
      Object.values(file.branchMap).map((branch) => startsOf(branch.locations)),
    ),
  ].join("|");

const [referencePath, targetPath] = process.argv.slice(2);
if (!referencePath || !targetPath) {
  console.error(
    "usage: node tools/align_coverage_maps.mts <reference.json> <target.json>",
  );
  process.exit(2);
}

const reference: Coverage = JSON.parse(fs.readFileSync(referencePath, "utf8"));
const target: Coverage = JSON.parse(fs.readFileSync(targetPath, "utf8"));

let aligned = 0;
const unaligned: string[] = [];
for (const [path, file] of Object.entries(target)) {
  const referenceFile = reference[path];
  if (referenceFile && shapeOf(referenceFile) === shapeOf(file)) {
    file.statementMap = referenceFile.statementMap;
    file.fnMap = referenceFile.fnMap;
    file.branchMap = referenceFile.branchMap;
    aligned++;
  } else if (referenceFile) {
    unaligned.push(path);
  }
}

fs.writeFileSync(targetPath, JSON.stringify(target));
console.log(`Aligned ${aligned} file(s) in ${targetPath}`);
for (const path of unaligned) {
  console.warn(
    `Could not align ${path}; its counts are merged as separate entries`,
  );
}
