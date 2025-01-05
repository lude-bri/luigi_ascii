#!/bin/bash

# Caminho dos frames
FRAMES_DIR="$HOME/gif2ascii/frames"

while true; do
  for FRAME in $(ls "$FRAMES_DIR"/*.txt | sort -V); do
    clear
    cat "$FRAME"
    sleep 0.1
  done
done

