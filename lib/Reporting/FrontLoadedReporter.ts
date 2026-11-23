import type { Config } from "../config";
import { Reporter } from "../Core/Reporter";

import DiffReporterAggregate from "./DiffReporterAggregate";
import AiCodingAgentReporter from "./Reporters/aicodingagentReporter";

export class DefaultFrontLoadedReporter extends DiffReporterAggregate {
  constructor() {
    super([new AiCodingAgentReporter()]);
  }
}

export function getFrontLoadedReporter(
  config: Partial<Config>,
): Reporter | null {
  if (config.frontLoadedReporter === undefined) {
    return new DefaultFrontLoadedReporter();
  }
  return config.frontLoadedReporter;
}

export function withFrontLoadedReporter(
  config: Partial<Config>,
  reporters: Reporter[],
): Reporter[] {
  const frontLoaded = getFrontLoadedReporter(config);
  return frontLoaded ? [frontLoaded, ...reporters] : reporters;
}
