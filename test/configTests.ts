import {expect} from "chai";
import sinon from "sinon";
import fs from "fs";
import _ from "lodash";
import {defaultConfig, getConfig, getHomeApprovalConfig, reset} from "../lib/config";

describe("config.js - ", function () {
  let fsExistsSyncStub;
  let fsReadFileSyncStub;

  beforeEach(function () {
    fsExistsSyncStub = null;
    reset();
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
      const configFile = getHomeApprovalConfig();

      expect(configFile).to.not.exist;
    });

    it("should load default config", function () {
      reset();
      const configFile = getConfig();
      expect(configFile).to.deep.equal(defaultConfig);
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
      const configFile = getHomeApprovalConfig();

      expect(configFile).to.exist;
    });

    it("should parse and return reporters array", function () {
      configToLoad = {
        reporters: ["gitdiff"],
      };

      const configFile = getHomeApprovalConfig();

      expect(configFile?.reporters).to.deep.equal(["gitdiff"]);
    });

    //it("but it is malformed it should raise exception with help about how to setup the file", function(){
    //  configToLoad = "as dfa: sdf asdf";
    //  expect(function() {
    //    config.getHomeApprovalConfig();
    //  }).to.throw(/Error parsing (.*).approvalsConfig/);
    //});

    it("should load user's config", function () {
      configToLoad = {
        myConfig: true,
      };
      const expectedConfig = _.defaults(configToLoad, defaultConfig);
      reset();
      const configFile = getConfig();
      expect(configFile).to.deep.equal(expectedConfig);
    });
  });
});
