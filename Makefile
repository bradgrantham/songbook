# Simple Makefile to build HTML and PDF versions of songs using chordpro

SONG_SRC := $(wildcard songs/*.cho)
SONG_HTML := $(patsubst songs/%.cho, build/%.html, $(SONG_SRC))
SONG_PDF := $(patsubst songs/%.cho, build/%.pdf, $(SONG_SRC))
SONGBOOK := kc_songbook.pdf

.PHONY: all clean

all: $(SONG_HTML) $(SONG_PDF) $(SONGBOOK)

build:
	mkdir -p build

build/%.pdf: songs/%.cho | build
	chordpro -o $@ $<

build/%.html: songs/%.cho | build
	chordpro -o $@ $<

$(SONGBOOK): $(SONG_SRC)
	chordpro -o $@ $^