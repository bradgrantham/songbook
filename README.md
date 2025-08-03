This is a collection of some of the songs used by the Jamcrowd.

The songs are stored in `songs/` as [ChordPro](https://www.chordpro.org/chordpro/) files (`.cho`).

# Creating HTML or PDF

## Prerequisites

* [`chordpro`](https://www.chordpro.org/) CLI tool.

## Building

Run `make` to generate HTML and PDF versions of all songs. The files will be
written to the `build/` directory. Individual songs can be generated with, e.g.,
`make build/horse_with_no_name.pdf` or `make build/horse_with_no_name.html`.

The build process now runs in a single step using the `chordpro` command.
