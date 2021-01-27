// convert basic chordpro(.chopro) to HTML
// -Don Mahurin

function chopro2html(text)
{
	text = text.replace(/^<pre>/i, '');
	text = text.replace(/<\/pre>$/i, '');
	var lines = text.split("\n");
	var pre = 0;
	var matches;
	var textsize;
	var chordsize;

	for (var i=0; i < lines.length; i++)
	{
		// chomp
		lines[i] = lines[i].replace(/\s*(\n|\r)+$/, '');

		if(lines[i] == "{colb}" || lines[i] == "{column_break}")
		{
			lines[i] = "</td><td>\n";
		}
		else if(lines[i] == "{sot}" || lines[i] == "{start_of_tab}")
		{
			pre = 1;
			lines[i] = "<pre>";
		}
		else if(lines[i] == "{eot}" || lines[i] == "{end_of_tab}")
		{
			pre = 0;
			lines[i] = "</pre>\n";
		}
		else if(lines[i] == "{soc}" || lines[i] == "{start_of_chorus}")
		{
			lines[i] = "CHORUS:";
		}
		else if(lines[i] == "{eoc}" || lines[i] == "{end_of_chorus}")
		{
			lines[i] = "";
		}
		else if(null != (matches = lines[i].match(/^{textsize:\s*(\d+)\s*}/)))
		{
			lines[i] = '';
			textsize = matches[1];
		}
		else if(null != (matches = lines[i].match(/^{chordsize:\s*(\d+)\s*}/)))
		{
			chordsize = matches[1];
		}
		else if(null != (matches = lines[i].match(/^{define:\s*?(\S+)\s+(base-fret\s+([\d]+)\s+frets\s+)?([xo\d]+)\s+([xo\d]+)\s+([xo\d]+)\s+([xo\d]+)\s+([xo\d]+)\s+([xo\d]+)\s*}$/)))
		{
			matches.shift();
			// chord definition
			var name = matches.shift();

			var offset = 0;
			offset = matches[0] != null ? parseInt(matches[1]) - 1 : 0;

			matches.shift();
			matches.shift();
			for(var s=0; s < 6; s++)
			{
				if(matches[s] == 'o') matches[s] = offset;
				if(matches[s] != 'x')
					matches[s] = parseInt(matches[s]) + offset;
			}
			matches.unshift(name);

			lines[i] = '<table cellspacing=0 style="border:1px solid"><tr><td width="150">' + matches.join('</td><td align="center" width="15">') + "</table>\n";
		}
		else if(null != (matches = lines[i].match(/^{(title|t):([^}]*)}/)))
		{
			lines[i] = "<b>" + matches[2] + "</b><br>\n";
		}
		else if(null != (matches = lines[i].match(/^{(subtitle|st):([^}]*)}/)))
		{
			lines[i] = "<i>" + matches[2] + "</i><br>\n";
		}
		else if(null != (matches = lines[i].match(/^{(c|comment):([^}]*)}/)))
		{
			lines[i] = "<i>" + matches[2] + "</i><br>\n";
		}
		else if(pre == 1)
		{
			// line unchanged
			lines[i] += "\n";
		}
		else if(null != (lines[i].match(/^#/)))
		{
			// remove comment line
			lines[i] = "";
		}
		else if(null != (lines[i].match(/^[^\[\]]*$/)))
		{
			// lines without []
			lines[i] = lines[i] + "<br>\n";
		}
		//else if(null != (lines[i].match(/^(\s*\[[^\[\]]+\]\s*)*$/)))
		else if(null != (lines[i].match(/^[^\[]*(\s*\[[^\[\]]+\]\s*)*$/)))
		{
			// lines with only chords (or only trailing chords)
			lines[i] = lines[i].replace(/\[(\([^\]\)]+\)\s*)?([^\]\s\(\)]+)(\s*\([^\]\s\)]+\))?\]/g, "$1<b>$2</b>$3") + "<br>";
			lines[i] = lines[i].replace(/\s/g, '&nbsp;');
		}
		else // lyric+chord line
		{
			// replace all tabs with spaces. Below we will use a tab a place holder for a table entry
			lines[i] = lines[i].replace(/\t/g, ' ');

			// Give stand-alone chords, 3 spaces, by adding trailing nbsp which will place below in lyrics
			lines[i] = lines[i].replace(/(\s|^)(\[[^\]\s]+\])(?=\s|$)/g, "\t$1$2&nbsp;&nbsp;&nbsp;");

			// xxx[ or [xxx]xxx[
			// prevents previous chord from causing wordsplitting 
			lines[i] = lines[i].replace(/((\[[^\]\s]\])?[^\[\]\s]+)(?=\[)/g, "\t$1");
			// ]\t
			// if above created tabled entry right after chord, we must add an nbsp to raise the chord
			lines[i] = lines[i].replace(/(\])(\t)/g, "$1&nbsp;$2");

			// [xxx]x or x[xxx]
			//lines[i] = lines[i].replace(/\[([^\]\(\s]+)(\([^\]\s]\))?\](?=[^\s\[\]])/g, "\t<b>$1</b>$2<br>");
			lines[i] = lines[i].replace(/\[(\([^\]\)]+\)\s*)?([^\]\s\(\)]+)(\s*\([^\]\)]+\))?\]/g, "\t$1<b>$2</b>$3&nbsp;<br>");

			// preserve leading and trailing spaces in table entry
			lines[i] = lines[i].replace(/\t +/g, "\t&nbsp;");
			lines[i] = lines[i].replace(/ +\t/g, "&nbsp;\t");
			lines[i] = lines[i].replace(/<br> +/g, "<br>&nbsp;");

			// preserve leading space
//			lines[i] = lines[i].replace(/^\s+/g, "&nbsp;&nbsp;");

			// each lyric line with chords is a table
			// Each chord starts a new table column
			lines[i] = '<table border=0" cellspacing=0><tr><td style="padding-left: 0px; padding-right: 0px;"></td></tr><tr><td valign="bottom" nowrap style="padding-left: 0px; padding-right: 0px;">' +
			lines[i].replace(/\t+/g, '</td><td nowrap valign="bottom" style="padding-left: 0px; padding-right: 0px;">') +
			"&nbsp;</td></tr></table>\n";
// debug
//			lines[i] = lines[i].replace(/</g, "&lt;");
//			lines[i] = lines[i].replace(/>/g, "&gt;");
		}
	}
	// remove beginning and trailing blank lines
	while(lines.length > 0 && lines[0] == "<br>\n")
		lines.shift();
	while(lines.length > 0 && lines[0] == "<br>\n")
		lines.pop();

	return ((textsize != null ? ('<style type="text/css">* {font-size: ' + textsize + 'px; }</style>'):'') +
	'<table width="100%" border=0 cellpadding=0 cellspacing=0><tr valign="top"><td valign="top">' +
	lines.join('') +
	'</td></td></table>');

}

function convert()
{
	document.body.innerHTML = chopro2html(document.body.innerHTML);
}

window.onload = convert;
