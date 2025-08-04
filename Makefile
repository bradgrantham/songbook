# Simple Makefile to build HTML and PDF versions of songs using chordpro

SONG_SRC := $(filter-out songs/allsongs.cho, $(wildcard songs/*.cho))
SONG_HTML := $(patsubst songs/%.cho, build/%.html, $(SONG_SRC))
SONG_PDF := $(patsubst songs/%.cho, build/%.pdf, $(SONG_SRC))

# Songs to include in the combined songbook, in order, taken from kc_songbook.chopro
SONGBOOK_LIST := $(shell sed -n 's/{include:guitartex\/\([^}]*\)\.chopro}/\1/p' kc_songbook.chopro)
SONGBOOK_SRC := $(addprefix songs/,$(addsuffix .cho,$(SONGBOOK_LIST)))
SONGBOOK := kc_songbook.pdf

.PHONY: all clean

all: $(SONG_HTML) $(SONG_PDF) $(SONGBOOK)

build:
	mkdir -p build

build/%.pdf: songs/%.cho | build
	chordpro -o $@ $<

build/%.html: songs/%.cho | build
	chordpro -o $@ $<


$(SONGBOOK): kc_songbook.chopro $(SONGBOOK_SRC)
	chordpro -o $@ $(SONGBOOK_SRC)

clean:
	rm -rf build
