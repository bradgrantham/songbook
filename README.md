This is a collection of some of the songs played used by the Jamcrowd.

The songs are in ChordPro format, embedded in HTML.

The HTML files reference some Javascript developed by Don Mahurin to reformat the ChordPro as HTML.

jc_songbook.pdf is the Jamcrowd version.  This is slightly longer and contains some songs we like to play in the Jamcrowd that other groups may not know.

kc_songbook.pdf is the songbook that the Karma Chickens used to play at Burning man, and any random group of people may be more likely to know.

# Creating a PDF book

## Prerequisites:

* `pdflatex` - I was able to install this on macOS through the `texlive-latex` port.
* `makeindex` - I was able to install this on macOS through the `texlive-basic` port.
* `titlepic.sty` - I've also vendored a copy in tools/ but you'll have to manage installing that yourself.
* `gchords.sty` - I'm using 1.21, available from https://kasper.phi-sci.com/gchords/.  I've also vendored a copy in tools/ but you'll have to manage installing that yourself.
* `gtx2tex` - This can be installed from https://sourceforge.net/projects/guitartex/files/GuitarTeX/GuitarTeX-2.8.2/

(GuitarTeX 2.8.2 is more than 20 years old and very fragile.  If you have trouble getting it to run, you may have some luck by instead using the Docker image from https://github.com/SickHub/docker-texlive-guitartex, but you're probably going to have to wing it.  RUN_IN_CONTAINER has the commands using `podman` to execute `gtx2tex` and then `pdflatex` inside the image.)

## Building the PDF

* `make jc_songbook.pdf` to generate the Jamcrowd version.
* `make kc_songbook.pdf` to generate the Karma Chickens version.

(The Makefile is also very fragile and needs revamping.)

Good luck!
