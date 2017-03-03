

var noScrubber = function (data) {
  return data;
};

var dateScrubber = function (data) {
  return (data || '').replace(/[0-9]*-[0-9]*-[0-9]*/g, '**Scrubbed-Date**');
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
  dateScrubber: dateScrubber,
  multiScrubber: multiScrubber
};
