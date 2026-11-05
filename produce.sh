#!/usr/bin/env bash
# One-command production: ./produce.sh episodes/<ep-folder>
set -euo pipefail
EP="${1:?usage: ./produce.sh episodes/<ep-folder>}"
cd "$(dirname "$0")"
python3 pipeline/tts/synth.py "$EP"           # narration.wav + aligned timeline.json
node pipeline/render/render.js "$EP"          # frames -> video_noaudio.mp4, cues.json, .srt
python3 pipeline/audio/mix.py "$EP"           # sfx + music bed + loudness -> final mp4
python3 pipeline/qa/qa.py "$EP"               # automated QA (exit 1 on failure)
