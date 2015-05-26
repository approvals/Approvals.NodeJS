/*jshint expr:true */
'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var fs = require('fs');
var _ = require('lodash');

var config = require('../lib/config');

describe("config.js - ", function(){

  var fsExistsSyncStub;
  var fsReadFileSyncStub;

  beforeEach(function(){
    fsExistsSyncStub = null;
    config.reset();
  });

  afterEach(function(){
    if (fsExistsSyncStub) {
      fsExistsSyncStub.restore();
    }

    if (fsReadFileSyncStub) {
      fsReadFileSyncStub.restore();
    }
  });

  describe("when a config file does not exist in a user's home directory", function(){
    beforeEach(function(){
      fsExistsSyncStub = sinon.stub(fs, 'existsSync', function(){
        return false;
      });
    });

    it("should not find config in user home directory", function(){
      var configFile = config.getHomeApprovalConfig();

      expect(configFile).to.not.exist;
    });

    it("should load default config", function(){
      var configFile = config.getConfig();
      expect(configFile).to.deep.equal(config.defaultConfig);
    });

  });

  describe("when a config file exists in a user's home directory", function(){
    var configToLoad;
    beforeEach(function() {
      configToLoad = {
      };

      fsExistsSyncStub = sinon.stub(fs, 'existsSync', function(){
        return true;
      });

      fsReadFileSyncStub = sinon.stub(fs, 'readFileSync', function(){
        var data = typeof configToLoad === "string" ? configToLoad : JSON.stringify(configToLoad, null, '  ');
        return new Buffer(data);
      });
    });

    it("should find config in user home directory", function() {
      var configFile = config.getHomeApprovalConfig();

      expect(configFile).to.exist;
    });

    it("should parse and return reporters array", function(){
      configToLoad = {
        reporters: [
          "gitdiff"
        ]
      };

      var configFile = config.getHomeApprovalConfig();

      expect(configFile.reporters).to.deep.equal(["gitdiff"]);
    });

    //it("but it is malformed it should raise exception with help about how to setup the file", function(){
    //  configToLoad = "as dfa: sdf asdf";
    //  expect(function() {
    //    config.getHomeApprovalConfig();
    //  }).to.throw(/Error parsing (.*).approvalsConfig/);
    //});

    it("should load user's config", function(){
      configToLoad = {
        myConfig: true
      };
      var expectedConfig = _.defaults(configToLoad, config.defaultConfig);
      var configFile = config.getConfig();
      expect(configFile).to.deep.equal(expectedConfig);
    });
  });

});
