# Introduction
This tool removes the built files for Javascript/Java/C++/C# projects, i.e., the files in "node_modules" and "target" folder, to free up some disk space

BTW, the code is mainly written by New Bing, I just made a little modification

# Setup
1. install Node.js on your computer
2. clone the source code, go to the source folder, run 'npm install"
3. modify "exclude.txt" as needed, put the want-to-ignore file or folder names in that file, each in a row

# Usage
node delete.js "c:\mycode"
