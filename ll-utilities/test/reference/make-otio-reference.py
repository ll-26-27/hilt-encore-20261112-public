# Reference only: what the original's OTIO path (bites/timeline.py single_angle) writes for three bites.
import sys
from pathlib import Path
import opentimelineio as otio
src = Path(sys.argv[1]); fps = 30; base = 10*3600*30; frames = 431
bites = [('one', 58, 158), ('two', 200, 323), ('three', 330, 415)]
rt = lambda n: otio.opentime.RationalTime(n, fps)
tr = lambda a, n: otio.opentime.TimeRange(rt(a), rt(n))
t = otio.schema.Timeline(name='ref')
for kind in (otio.schema.TrackKind.Video, otio.schema.TrackKind.Audio):
    track = otio.schema.Track(kind=kind)
    for name, i, o in bites:
        ref = otio.schema.ExternalReference(target_url=src.as_uri(), available_range=tr(base, frames))
        track.append(otio.schema.Clip(name=name, media_reference=ref, source_range=tr(base+i, o-i)))
    t.tracks.append(track)
otio.adapters.write_to_file(t, 'ref.xml', adapter_name='fcp_xml')
otio.adapters.write_to_file(t, 'ref.fcpxml', adapter_name='fcpx_xml')

# How these reference files were made (Nov 12, 2026), for comparison only; the kit doesn't use Python:
#   uv venv -p 3.13 otio-venv && uv pip install -p otio-venv/bin/python opentimelineio==0.18.1 otio-fcp-adapter==1.0.0
#   otio-venv/bin/python make-otio-reference.py <kit>/_media/fixtures/bites/workshop.mov
# then file:// paths were replaced with file:///FIXTURE/. otio-fcp7-two-angles.xml came from the
# same timeline built the way the hackathon's bites/timeline.py two_angle_timeline() builds it
# (camera B: workshop-b.mov, 10:00:00:09, 422 frames; bites 58-158 and 200-323).
