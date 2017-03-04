

var noScrubber = function (data) {
  return data;
};

var guidScrubber = function (data) {
  return (data || '').replace(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/ig, '**Scrubbed-GUID**');
};

var multiScrubber = function(scrubbers) {
  return function(data){

    scrubbers.forEach(function(scrubber) {
      data = scrubber(data);
    });

    return data
  }
}

module.exports = {
  noScrubber: noScrubber,
  guidScrubber: guidScrubber,
  multiScrubber: multiScrubber
};
