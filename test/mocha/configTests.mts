import fs from "fs";

import * as chai from "chai";
import _ from "lodash";
import sinon from "sinon";

import * as cfg from "../../lib/config.js";

const expect = chai.expect;
const readme = fs.readFileSync(
  new URL("../../readme.md", import.meta.url),
  "utf8",
);
describe("config.js - ", function () {
  let fsExistsSyncStub;
  let fsReadFileSyncStub;

  beforeEach(function () {
    fsExistsSyncStub = null;
    cfg.reset();
  });

  afterEach(function () {
    if (fsExistsSyncStub) {
      fsExistsSyncStub.restore();
    }

    if (fsReadFileSyncStub) {
      fsReadFileSyncStub.restore();
    }
  });

  describe("when a config file does not exist in a user's home directory", function () {
    beforeEach(function () {
      fsExistsSyncStub = sinon.stub(fs, "existsSync").callsFake(function () {
        return false;
      });
    });

    it("should not find config in user home directory", function () {
      const configFile = cfg.getHomeApprovalConfig();

      expect(configFile).to.equal(null);
    });

    it("should load default config", function () {
      cfg.reset();
      const configFile = cfg.getConfig();
      expect(configFile).to.deep.equal(cfg.defaultConfig);
    });
  });

  describe("when a config file exists in a user's home directory", function () {
    let configToLoad;
    beforeEach(function () {
      configToLoad = {};

      fsExistsSyncStub = sinon.stub(fs, "existsSync").callsFake(function () {
        return true;
      });

      fsReadFileSyncStub = sinon
        .stub(fs, "readFileSync")
        .callsFake(function () {
          const data =
            typeof configToLoad === "string"
              ? configToLoad
              : JSON.stringify(configToLoad, null, "  ");
          return Buffer.from(data);
        });
    });

    it("should find config in user home directory", function () {
      const configFile = cfg.getHomeApprovalConfig();

      expect(configFile).to.not.equal(null);
    });

    for (const format of ["yaml", "json"]) {
      it(`should load the documented ${format} configuration`, function () {
        const section = readme.split("## Configuration")[1].split("## API")[0];
        const example = section.match(
          new RegExp("```" + format + "\\n([\\s\\S]*?)```"),
        );
        expect(example, `missing ${format} example`).to.not.equal(null);
        configToLoad = example![1];
        cfg.reset();

        const config = cfg.getConfig();

        expect(config.reporters).to.deep.equal(["nodediff"]);
        expect(config.appendEOL).to.equal(false);
        expect(config.stripBOM).to.equal(cfg.defaultConfig.stripBOM);
      });
    }

    it("should parse and return reporters array", function () {
      configToLoad = {
        reporters: ["gitdiff"],
      };

      const configFile = cfg.getHomeApprovalConfig();

      expect(configFile?.reporters).to.deep.equal(["gitdiff"]);
    });

    it("should load user's config", function () {
      configToLoad = {
        myConfig: true,
      };
      const expectedConfig = _.defaults(configToLoad, cfg.defaultConfig);
      cfg.reset();
      const configFile = cfg.getConfig();
      expect(configFile).to.deep.equal(expectedConfig);
    });
  });
});
