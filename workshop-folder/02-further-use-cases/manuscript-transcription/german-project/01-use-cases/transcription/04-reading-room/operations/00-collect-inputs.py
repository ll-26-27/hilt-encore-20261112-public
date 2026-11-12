"""Verify the bundled inputs already collected from the upstream layout/hybrid case."""
from pathlib import Path
import hashlib
import json

case = Path(__file__).resolve().parents[1]
checks = json.loads((case / "operations/input-checksums.json").read_text())
for name, expected in checks.items():
    path = case / name
    if hashlib.sha256(path.read_bytes()).hexdigest() != expected:
        raise SystemExit(f"Input checksum mismatch: {name}")
print(f"Verified {len(checks)} bundled inputs. Original origins remain in inputs/readings/provenance.json.")
