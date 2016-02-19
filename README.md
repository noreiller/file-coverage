FILE COVERAGE
-------------

This tool can be used to ensure that all the files of an app have a test.
It also be used for any other purpose since it only performs a file name comparison.

# Installation

````
$ npm install --save-dev file-coverage
````


# Use the command line

Create a **.coverage** file at the root of your project with your custom configuration (see below).

````
$ file-coverage
````

Or use it as a node module to handle by yourself the results and/or the output.

````
import fileCoverage from 'file-coverage'

fileCoverage().then((data) => {
  // Do whatever you want
})
````

# Output

The data contains the **params** and **results** entries. The **params** are those used to compare the folders. The **results** contains:

* **filenames** (*Object*)
  * **source** (*Array* []): the found source files
  * **target** (*Array* []): the found target files
  * **excluded** (*Array* []): the found excluded files
  * **unfound** (*Array* []): the unfound files according to the source files
* **counts** (*Number*): the files count (mirroring the filenames)
  * **source** (*Number* 0)
  * **target** (*Number* 0)
  * **excluded** (*Number* 0)
  * **found** (*Number* 0)
  * **unfound** (*Number* 0)
* **rate** (*Number* 0): the coverage rate


# Configuration

The **.coverage** file parameters:

* **pattern** (*String* "\*\*/\*"): the pattern of the files to find (see [glob supports]())
* **source** (required *String*): the directory to find in
* **target** (required *String*): the directory to compare
* **target_prefix** (*String* ""): the prefix of the target file name
* **target_suffix** (*String* "-test"): the suffix of the target file name
* **rate_high** (*Number* 70): the comparison rate which renders a valid output
* **rate_low** (*Number* 30): same as ahead but for invalid output
* **excluded_files** (*Array* []): a list of file paths which will be excluded from the comparison


The node package parameters:

* **path** (*String* `process.cwd()`): the path to your **.coverage** file.
* **config_file** (*String* ".coverage"): the path to your **.coverage** file.
* **callback** (*Function* `logToConsole`): the callback which is called when the comparison is done.
