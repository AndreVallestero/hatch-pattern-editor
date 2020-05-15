# Hatch patterns with dashed lines
1. Open an existing PAT file or create a new file in a text editor that saves in ASCII format (for example, Notepad on Windows® or TextEdit on Mac OS®).
2. Create a header line that includes an asterisk and a pattern name. The name of the hatch pattern is limited to 31 characters.

	For example, `*ANSI33`
	
	**Note:** If you are creating a new PAT file, the PAT file and pattern must have the same name.
3. (Optional) Include a description in the header line, follow the pattern name with a comma and description text.

	For example, ``*ANSI33, ANSI Bronze, Brass, Copper`
4. Create a descriptor line that includes
	- An angle at which the line is drawn
	- An X,Y origin point
	- A delta-x of any value if you want to offset alternating lines in the line family
	- A delta-y of any value
	- A value for a dash length
	- A value for a dot length
	- An optional second value for a different dash length
	- An optional second value for a different dot length

	For example,

	`45, 0,0, 0,.25`

	`45, .176776695,0, 0,.25, .125,-.0625`
	
5. Add a blank line after the last descriptor line.

    **Note:** If the blank line is missing, the hatch pattern won't be recognized by the program.
## Documentation

- [Homepage](../README.md)
- [About hatch patterns](about.md)
- [About hatch patterns with dashed lines](dashed-lines-about.md)
- [Hatch patterns with dashed lines examples](dashed-lines-examples.md)
- [About hatch patterns with multiple lines](multiple-lines-about.md)
- [Hatch patterns with multiple lines examples](multiple-lines-examples.md)
- [Source](https://help.autodesk.com/cloudhelp/2019/ENU/AutoCAD-LT/files/GUID-67150A48-FF70-4CC7-8C6E-21DEF6838C82.htm)