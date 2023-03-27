import {describe, test, expect} from "@jest/globals";
import {verify} from "../../../lib/Providers/Jest/JestApprovals";
import {ConfigModifier, Options} from "../../../lib/Core/Options";
import {JestReporter} from "../../../lib/Providers/Jest/JestReporter";


describe('JestReporter', () => {
  test('reports file contents', () => {
    try {
      let configModifier: ConfigModifier = c => {
        c.reporters = [
          new JestReporter()]
        return c;
      };
      let options = new Options();
      options = options.withConfig(configModifier);

      verify('Hello', options);
    } catch (error: any) {
      const message = error.message;
      // Approved file contains 'Goodbye', to force the call verify() to fail.
      // We test that jest-formatted output has shown the differences in the exception it throws.
      expect(message).toMatch(/- Goodbye/);
      expect(message).toMatch(/\+ Hello/);
    }
  });
});
