/* global expect */
'use strict';

require("../../../lib/Approvals")
  .jasmine();

describe('Jasmine Naming', function() {

  describe('uses describe', function() {
    it('uses it', function() {

      // This sets up the '.name' property
      this.approvals.namer.getApprovedFile(".txt");

      var name = this.approvals.namer.name;

      expect(name).toBe('Jasmine_Naming_uses_describe_uses_it');
    });

  });
});
