# About hash patterns with multiple lines
1. Open an existing PAT file or create a new file in a text editor that saves in ASCII format (for example, Notepad on Windows® or TextEdit on Mac OS®).
    
    **Note:** If you are creating a new PAT file, the PAT file and pattern must have the same name.
    
2. Create a header line that begins with an asterisk and includes a pattern name that is no more than 31 characters in length.

    For example, `*ANGLE`
    
3. Optionally, include a description for the hatch pattern by adding a comma and descriptive text after the pattern name.

    For example, `*ANGLE, Angle steel`
    
4. Create a descriptor line that includes
	- An angle at which the line is drawn
	- An `X,Y` origin point
	- A `delta-x` of any value if you want to offset alternating lines in the line family
	- A `delta-y` of any value
	- A value for a dash length
	- A value for a dot length
 	- An optional second value for a different dash length
	- An optional second value for a different dot length

    For example, `0, 0,0, 0,.275, .2,-.075`

5. Create a second line including all the parameters in the previous step.

    For example, `90, 0,0, 0,.275, .2,-.075`

6. Optionally, create additional lines to complete the multiple-line hatch pattern.

7. Add a blank line after the last descriptor line.

    **Note:** If the blank line is missing, the hatch pattern won't be recognized by the program.



## Documentation

- [Homepage](../README.md)
- [Generator](../generator.html)
- [About hash patterns](about.md)
- [About hash patterns with dashed lines](dashed-lines-about.md)
- [Hash patterns with dashed lines examples](dashed-lines-examples.md)
- [About hash patterns with multiple lines](multiple-lines-about.md)
- [Hash patterns with multiple lines examples](multiple-lines-examples.md)
- [Source](https://help.autodesk.com/cloudhelp/2019/ENU/AutoCAD-LT/files/GUID-F3333A6A-DE51-4864-BEA6-1C6C5BF9BEF8.htm)