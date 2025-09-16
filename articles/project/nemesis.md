<!-- *META -->

<!-- ----------------------------------------------------------------------- -->

## NEMESIS static analyzer

<!-- ------------------------- Quick Description --------------------------- -->

NEMESIS is a tool designed to evaluate software metrics and perform static code
inspections.

<!-- ----------------------------------------------------------------------- -->

<!-- !META -->

<!-- *CONTENT -->

<!-- ----------------------------------------------------------------------- -->

# NEMESIS Engine for Metrics Evaluation and Static Inspection of Software

<!-- ---------------------------- Description ------------------------------ -->

NEMESIS is a tool designed to evaluate software metrics and perform static
inspections. It provides a framework for analyzing code, providing metrics, and
generating reports. It can flag potential issues in the codebase, such as code
smells, complexity issues, and other maintainability concerns.

<!-- ---------------------------- Specification ---------------------------- -->

## Specification

NEMESIS is fully specified and documented. The specification tries to follow
the **ECSS-E-ST-40C** standard for software engineering and contains the **SRS**
(Software Requirements Specification), the **SDD** (Software Design Document),
and the **ICD** (Interface Control Document). The specification is available in
the `doc/TS/` directory of the repository.

<!-- ------------------------------- Help ---------------------------------- -->

## Help

You can get help on how to use NEMESIS by running the following command:

```bash
make help
```

<!-- ---------------------------- Installation ----------------------------- -->

## Installing NEMESIS

To install NEMESIS, follow these steps:

- Clone the repository:

```bash
git clone https://gitlab.esa.int/Theo.Bessel/nemesis.git
```

- Clone the LLVM repository:

```bash
git clone https://github.com/llvm/llvm-project.git
```

- Build and install LLVM and Clang:

```bash
cd llvm-project

mkdir build
cd build

cmake -G "Unix Makefiles" ../llvm \
      -DCMAKE_EXPORT_COMPILE_COMMANDS=ON \
      -DLLVM_ENABLE_PROJECTS="llvm;clang;clang-tools-extra" \
      -DCMAKE_BUILD_TYPE=Release \
      -DLLVM_ENABLE_BINDINGS=Off \
      -DLLVM_BUILD_DOCS=Off \
      -DLLVM_ENABLE_RTTI=ON

make -j 24
sudo make install -j 24
```

You can now build NEMESIS:

```bash
sudo make install
```

You might now be able to run NEMESIS:

```bash
nemesis --help
```

<!-- ----------------------------- Run NEMESIS ----------------------------- -->

## Running NEMESIS

To run NEMESIS, you can use the command line interface. The basic syntax is:

```bash
nemesis -c <config_file> <source_files>
```

For instance if you want to analyze a the file `main.cpp` of the following
project:

```
.
├── src/
│   ├── ...
│   └── main.cpp
├── config.json
└── CMakeLists.txt
```

You can the following command at the root of the project:

```bash
nemesis -c config.json src/main.cpp
```

NEMESIS will then analyze the source files and generate a report in the SARIF
format. The report will be saved at the root of the project in a file named
`report.sarif`.

<!--
**Note:** If you are trying to run NEMESIS on MacOS, you might need to add the
following parameter to the command line:

```bash
nemesis --extra-arg="-isysroot$(xcrun --sdk macosx --show-sdk-path)" \
        -c config.json src/main.cpp
```
-->

<!-- -------------------------- Supported Metrics -------------------------- -->

## Supported Metrics

NEMESIS currently supports the following metrics:

- Cyclomatic Complexity
- Line of code count
- Fan-out
- Fan-in
- Number of parameters
- Halstead complexity

And the following code smells:

- Use of `goto`
- Use of `volatile`
- Use of `__attribute__`
- Use of `extern`

<!-- ---------------------------- Configuration ---------------------------- -->

## Configuration

NEMESIS can be configured using a JSON file. The configuration file should
define the metrics to be computed and their thresholds. Here is an example of
the configuration file for Category A metrication :

```json
{
  "metrics": [
    {
      "name": "Cyclomatic Complexity",
      "threshold": { "type": "leq", "value": 10 },
      "enabled": true
    },
    {
      "name": "Nesting Depth",
      "threshold": { "type": "leq", "value": 5 },
      "enabled": true
    },
    {
      "name": "Lines of Code",
      "threshold": { "type": "leq", "value": 50 },
      "enabled": true
    },
    {
      "name": "Comment Frequency",
      "threshold": { "type": "geq", "value": 0.3 },
      "enabled": true
    },
    {
      "name": "Fan-Out",
      "threshold": { "type": "leq", "value": 2 },
      "enabled": true
    }
  ],
  "smells": [
    {
      "name": "Use of goto",
      "enabled": true
    }
    // ...
  ]
}
```

<!-- ---------------------------- Architecture ----------------------------- -->

## Architecture

Here is the file structure of NEMESIS:

```
src/
├── Main.cpp
├── utils/
│   ├── Logger.hpp
│   ├── Logger.cpp
│   └── ...
├── core/
│   ├── MetricationAction.hpp
│   ├── MetricConsumer.hpp
│   ├── config/
│   │   ├── Config.hpp
│   │   ├── Rule.hpp
│   │   ├── MetricRule.hpp
│   │   └── SmellRule.hpp
│   └─ report/
│       ├── Report.hpp
│       ├── Result.hpp
│       ├── MetricResult.hpp
│       └── SmellResult.hpp
└── plugins/
    ├── Plugin.hpp
    ├── source_analyzer/
    │   ├── SourceAnalyzer.hpp
    │   └── SourceAnalyzer.cpp
    ├── token_analyzer/
    │   ├── TokenAnalyzer.hpp
    │   └── TokenAnalyzer.cpp
    └── ast_analyzer/
        ├── AstAnalyzer.hpp
        └── AstAnalyzer.cpp
```

<!--! \cond -->

### Overview

<!--! \endcond -->

The architecture of NEMESIS is designed to be modular and extensible. It
consists of several key components:

- **Core**: The `core` package handles the main logic of the tool, including
  parsing source files, calculating metrics, and generating reports.

- **Analyzer**: The `analyzer` package is responsible for analyzing the source
  code and computing the defined metrics. It uses the Clang libraries to parse
  the code and extract relevant information.

- **Report**: The `report` package generates human-readable reports based on the
  computed metrics. It formats the output and provides a summary of the analysis.

- **Utils**: The `utils` package provides various utility functions and classes
  that are used throughout the tool. This includes functions for file I/O,
  string manipulation, and other common tasks.

<!--! \cond -->

<!--### Diagrams

The following PlantUML diagram illustrates the **architecture** of NEMESIS:

<figure align="center">
  <img src="doc/figures/architecture.png" width=500/>
  <figcaption><sup><u>NEMESIS class diagram</u></sup></figcaption>
</figure>

The following PlantUML diagram illustrates the **data flow** of NEMESIS:

<figure align="center">
  <img src="doc/figures/flow.png" width=500/>
  <figcaption><sup><u>NEMESIS sequence diagram</u></sup></figcaption>
</figure>-->

<!--! \endcond -->

<!-- ---------------------------- Contributing ----------------------------- -->

<!--! \cond -->

## Contributing

Contributions to NEMESIS are welcome! If you have suggestions for improvements,
bug reports, or feature requests, please open an issue on the project's GitLab
repository. If you would like to contribute code, please fork the repository
and submit a merge request.

You will be able to find the complete documentation of the code at :

https://theo.bessel.io.esa.int/nemesis/

You can also generate the documentation locally by running:

```bash
make doxygen
```

at the root of the project. This will generate the documentation in the
`doc/html/` directory.

### Maintainers

- Théo BESSEL (**<theo.bessel@ext.esa.int>**, <contact@theobessel.fr>)

<!--! \endcond -->

<!-- ----------------------------------------------------------------------- -->

<!-- !CONTENT -->