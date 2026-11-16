"""Run the generic plugin's jscpd sensor, keeping only clones that touch a scoped file."""

import json
import os
import subprocess
import sys
from pathlib import Path

import habit_hooks_generic


def main() -> int:
    separator = sys.argv.index("--")
    jscpd = sys.argv[1]
    scoped = {os.path.normpath(f) for f in sys.argv[separator + 1 :]}
    sensors = Path(habit_hooks_generic.__file__).parent / "sensors"
    result = subprocess.run(
        [sys.executable, str(sensors / "jscpd.py"), jscpd,
         "--fallback-config", str(sensors.parent / ".jscpd.json")],
        capture_output=True, encoding="utf-8", errors="replace",
    )
    if result.returncode != 0:
        sys.stderr.write(result.stderr)
        return result.returncode
    findings = [
        finding for finding in json.loads(result.stdout)
        if any(os.path.normpath(issue["key"]) in scoped for issue in finding["issues"])
    ]
    print(json.dumps(findings))
    return 0


if __name__ == "__main__":
    sys.exit(main())
