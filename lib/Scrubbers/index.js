

var noScrubber = function (data) {
  return data;
};


var guidScrubber = function (data) {

  const guidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/ig;

  const capturedGuids = []

  const result = data.replace(guidRegex, function(match) {
    // The arguments are:
    // 1: The whole match (string)
    // 2..n+1: The captures (string or undefined)
    // n+2: Starting position of match (0 = start)
    // n+3: The subject string.
    // (n = number of capture groups)

    if (capturedGuids.indexOf(match) < 0) {
      capturedGuids.push(match);
    }

    const index = capturedGuids.indexOf(match) + 1;

    return `guid_${index}`;

  });

  return result;

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
