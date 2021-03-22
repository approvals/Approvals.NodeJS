/*jshint expr:true */
'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var fs = require('fs');
var _ = require('lodash');

var cfg = require('../lib/config');

describe("config.js - ", function () {

  var fsExistsSyncStub;
  var fsReadFileSyncStub;

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
      fsExistsSyncStub = sinon.stub(fs, 'existsSync').callsFake(function () {
        return false;
      });
    });

    it("should not find config in user home directory", function () {
      var configFile = cfg.getHomeApprovalConfig();

      expect(configFile).to.not.exist;
    });

    it("should load default config", function () {
      var configFile = cfg.getConfig();
      expect(configFile).to.deep.equal(cfg.defaultConfig);
    });

  });

  describe("when a config file exists in a user's home directory", function () {
    var configToLoad;
    beforeEach(function () {
      configToLoad = {
      };

      fsExistsSyncStub = sinon.stub(fs, 'existsSync').callsFake(function () {
        return true;
      });

      fsReadFileSyncStub = sinon.stub(fs, 'readFileSync').callsFake(function () {
        var data = typeof configToLoad === "string" ? configToLoad : JSON.stringify(configToLoad, null, '  ');
        return Buffer.from(data);
      });
    });

    it("should find config in user home directory", function () {
      var configFile = cfg.getHomeApprovalConfig();

      expect(configFile).to.exist;
    });

    it("should parse and return reporters array", function () {
      configToLoad = {
        reporters: [
          "gitdiff"
        ]
      };

      var configFile = cfg.getHomeApprovalConfig();

      expect(configFile.reporters).to.deep.equal(["gitdiff"]);
    });

    //it("but it is malformed it should raise exception with help about how to setup the file", function(){
    //  configToLoad = "as dfa: sdf asdf";
    //  expect(function() {
    //    config.getHomeApprovalConfig();
    //  }).to.throw(/Error parsing (.*).approvalsConfig/);
    //});

    it("should load user's config", function () {
      configToLoad = {
        myConfig: true
      };
      var expectedConfig = _.defaults(configToLoad, cfg.defaultConfig);
      var configFile = cfg.getConfig();
      expect(configFile).to.deep.equal(expectedConfig);
    });
  });

});
