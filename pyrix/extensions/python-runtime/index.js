var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// extensions/python-runtime/index.ts
var pyodideInstance = null;
var currentProjectId = null;
async function activate(context) {
  context.logger.info("Python Runtime Extension activating...");
  async function initPyodide() {
    if (pyodideInstance) {
      return pyodideInstance;
    }
    const pyodide = await window.loadPyodide({
      stdout: /* @__PURE__ */ __name((msg) => context.logger.info(msg), "stdout"),
      stderr: /* @__PURE__ */ __name((msg) => context.logger.error(msg), "stderr")
    });
    pyodideInstance = pyodide;
    return pyodide;
  }
  __name(initPyodide, "initPyodide");
  function parseGitignore(content) {
    return content.split("\n").map((line) => line.trim()).filter((line) => line && !line.startsWith("#")).map((pattern) => {
      if (pattern.startsWith("/")) {
        pattern = pattern.substring(1);
      }
      return pattern;
    });
  }
  __name(parseGitignore, "parseGitignore");
  function isIgnored(filePath, patterns) {
    const normalizedPath = filePath.startsWith("/") ? filePath.substring(1) : filePath;
    for (const pattern of patterns) {
      if (pattern.endsWith("/")) {
        const dirPattern = pattern.slice(0, -1);
        if (normalizedPath.startsWith(dirPattern + "/") || normalizedPath === dirPattern) {
          return true;
        }
      } else if (pattern.includes("*")) {
        const regexPattern = pattern.replace(/\./g, "\\.").replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*").replace(/\?/g, ".");
        const regex = new RegExp(`^${regexPattern}$`);
        if (regex.test(normalizedPath)) {
          return true;
        }
      } else if (normalizedPath === pattern || normalizedPath.startsWith(pattern + "/")) {
        return true;
      }
    }
    return false;
  }
  __name(isIgnored, "isIgnored");
  function normalizePathToPyodide(projectPath) {
    if (!projectPath) return projectPath;
    const p = projectPath.startsWith("/") ? projectPath : `/${projectPath}`;
    if (p === "/pyodide") return "/";
    if (p.startsWith("/pyodide/")) return p.replace("/pyodide", "");
    return p;
  }
  __name(normalizePathToPyodide, "normalizePathToPyodide");
  function normalizePathFromPyodide(pyodideRelativePath) {
    if (!pyodideRelativePath) return pyodideRelativePath;
    const p = pyodideRelativePath.startsWith("/") ? pyodideRelativePath : `/${pyodideRelativePath}`;
    if (p === "/pyodide") return "/";
    if (p.startsWith("/pyodide/")) return p.replace("/pyodide", "");
    return p;
  }
  __name(normalizePathFromPyodide, "normalizePathFromPyodide");
  async function syncFilesToPyodide(projectId) {
    if (!pyodideInstance) return;
    const fileRepository = await context.getSystemModule("fileRepository");
    await fileRepository.init();
    try {
      const files = await fileRepository.getProjectFiles(projectId);
      let gitignorePatterns = [];
      const gitignoreFile = files.find((f) => f.path === "/.gitignore" || f.path === ".gitignore");
      if (gitignoreFile && gitignoreFile.content) {
        gitignorePatterns = parseGitignore(gitignoreFile.content);
      }
      try {
        const homeContents = pyodideInstance.FS.readdir("/home");
        for (const item of homeContents) {
          if (item !== "." && item !== "..") {
            try {
              pyodideInstance.FS.unlink(`/home/${item}`);
            } catch {
              try {
                pyodideInstance.FS.rmdir(`/home/${item}`);
              } catch {
              }
            }
          }
        }
      } catch {
        try {
          pyodideInstance.FS.mkdir("/home");
        } catch {
        }
      }
      let syncedCount = 0;
      let ignoredCount = 0;
      for (const file of files) {
        if (file.type === "file" && file.path && file.content) {
          if (isIgnored(file.path, gitignorePatterns)) {
            ignoredCount++;
            continue;
          }
          try {
            const normalizedProjectPath = normalizePathToPyodide(file.path);
            const pyodidePath = `/home${normalizedProjectPath}`;
            const dirPath = pyodidePath.substring(0, pyodidePath.lastIndexOf("/"));
            if (dirPath && dirPath !== "/home") {
              createDirectoryRecursive(pyodideInstance, dirPath);
            }
            pyodideInstance.FS.writeFile(pyodidePath, file.content);
            syncedCount++;
          } catch (error) {
            context.logger.warn(`Failed to sync file ${file.path}:`, error);
          }
        }
      }
      context.logger.info(
        `\u2705 Synced ${syncedCount} files to Pyodide` + (ignoredCount > 0 ? ` (${ignoredCount} ignored by .gitignore)` : "")
      );
    } catch (error) {
      context.logger.error("Failed to sync files to Pyodide:", error);
    }
  }
  __name(syncFilesToPyodide, "syncFilesToPyodide");
  function createDirectoryRecursive(pyodide, path) {
    const parts = path.split("/").filter((p) => p);
    let currentPath = "";
    for (const part of parts) {
      currentPath += "/" + part;
      try {
        pyodide.FS.mkdir(currentPath);
      } catch {
      }
    }
  }
  __name(createDirectoryRecursive, "createDirectoryRecursive");
  const pyodidePackages = [
    "numpy",
    "pandas",
    "matplotlib",
    "scipy",
    "sklearn",
    "sympy",
    "networkx",
    "seaborn",
    "statsmodels",
    "micropip",
    "bs4",
    "lxml",
    "pyyaml",
    "requests",
    "pyodide",
    "pyparsing",
    "dateutil",
    "jedi",
    "pytz",
    "sqlalchemy",
    "pyarrow",
    "bokeh",
    "plotly",
    "altair",
    "openpyxl",
    "xlrd",
    "xlsxwriter",
    "jsonschema",
    "pillow",
    "pygments",
    "pytest",
    "tqdm",
    "scikit-image",
    "scikit-learn",
    "shapely",
    "zipp"
  ];
  async function runPythonWithSync(code, projectId) {
    const pyodide = await initPyodide();
    await syncFilesToPyodide(projectId);
    const importRegex = /^\s*import\s+([\w_]+)|^\s*from\s+([\w_]+)\s+import/gm;
    const packages = /* @__PURE__ */ new Set();
    let match;
    while ((match = importRegex.exec(code)) !== null) {
      if (match[1]) packages.add(match[1]);
      if (match[2]) packages.add(match[2]);
    }
    const toLoad = Array.from(packages).filter((pkg) => pyodidePackages.includes(pkg));
    if (toLoad.length > 0) {
      try {
        context.logger.info(`\u{1F4E6} Loading Pyodide packages: ${toLoad.join(", ")}`);
        await pyodide.loadPackage(toLoad);
      } catch (e) {
        context.logger.warn(`\u26A0\uFE0F Failed to load some packages: ${toLoad.join(", ")}`, e);
      }
    }
    let stdout = "";
    let stderr = "";
    const captureCode = `
import sys
import io
_pyxis_stdout = sys.stdout
_pyxis_stringio = io.StringIO()
sys.stdout = _pyxis_stringio
try:
  exec("""${code.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}""", globals())
  _pyxis_result = _pyxis_stringio.getvalue()
finally:
  sys.stdout = _pyxis_stdout
del _pyxis_stringio
del _pyxis_stdout
`;
    try {
      await pyodide.runPythonAsync(captureCode);
      stdout = pyodide.globals.get("_pyxis_result") || "";
      pyodide.globals.set("_pyxis_result", void 0);
    } catch (error) {
      stderr = error.message || String(error);
    }
    await syncFilesFromPyodide(projectId);
    return { result: stdout.trim(), stdout: stdout.trim(), stderr: stderr.trim() };
  }
  __name(runPythonWithSync, "runPythonWithSync");
  async function syncFilesFromPyodide(projectId) {
    if (!pyodideInstance) return;
    const fileRepository = await context.getSystemModule("fileRepository");
    await fileRepository.init();
    const pathUtils = await context.getSystemModule("pathUtils");
    try {
      const existingFiles = await fileRepository.getProjectFiles(projectId);
      const existingPaths = new Map(existingFiles.map((f) => [f.path, f]));
      let gitignorePatterns = [];
      const gitignoreFile = existingFiles.find((f) => f.path === "/.gitignore" || f.path === ".gitignore");
      if (gitignoreFile && gitignoreFile.content) {
        gitignorePatterns = parseGitignore(gitignoreFile.content);
      }
      const pyodideFiles = scanPyodideDirectory(pyodideInstance, "/home", "");
      let syncedCount = 0;
      let newFilesCount = 0;
      let updatedFilesCount = 0;
      let ignoredCount = 0;
      for (const file of pyodideFiles) {
        const projectPath = normalizePathFromPyodide(file.path);
        if (isIgnored(projectPath, gitignorePatterns)) {
          ignoredCount++;
          continue;
        }
        const existingFile = existingPaths.get(projectPath);
        if (existingFile) {
          if (existingFile.content !== file.content) {
            await fileRepository.updateFileContent(existingFile.id, file.content);
            updatedFilesCount++;
            syncedCount++;
          }
        } else {
          const isPythonSource = projectPath.endsWith(".py");
          const wasInOriginalProject = existingFiles.some((f) => f.path === projectPath);
          if (!isPythonSource || !wasInOriginalProject) {
            await fileRepository.createFile(projectId, projectPath, file.content, "file");
            newFilesCount++;
            syncedCount++;
          }
        }
      }
      if (syncedCount > 0 || ignoredCount > 0) {
        context.logger.info(
          `\u2705 Synced ${syncedCount} files from Pyodide (${newFilesCount} new, ${updatedFilesCount} updated)` + (ignoredCount > 0 ? ` - ${ignoredCount} ignored by .gitignore` : "")
        );
      }
    } catch (error) {
      context.logger.error("Failed to sync files from Pyodide:", error);
    }
  }
  __name(syncFilesFromPyodide, "syncFilesFromPyodide");
  function scanPyodideDirectory(pyodide, pyodidePath, relativePath) {
    const results = [];
    try {
      const contents = pyodide.FS.readdir(pyodidePath);
      for (const item of contents) {
        if (item === "." || item === "..") continue;
        const fullPyodidePath = `${pyodidePath}/${item}`;
        const fullRelativePath = relativePath ? `${relativePath}/${item}` : `/${item}`;
        try {
          const stat = pyodide.FS.stat(fullPyodidePath);
          if (pyodide.FS.isDir(stat.mode)) {
            results.push(...scanPyodideDirectory(pyodide, fullPyodidePath, fullRelativePath));
          } else {
            const content = pyodide.FS.readFile(fullPyodidePath, { encoding: "utf8" });
            results.push({ path: fullRelativePath, content });
          }
        } catch (error) {
          context.logger.warn(`Failed to process: ${fullPyodidePath}`, error);
        }
      }
    } catch (error) {
      context.logger.warn(`Failed to read directory: ${pyodidePath}`, error);
    }
    return results;
  }
  __name(scanPyodideDirectory, "scanPyodideDirectory");
  await context.registerRuntime?.({
    id: "python",
    name: "Python",
    supportedExtensions: [".py"],
    canExecute(filePath) {
      return filePath.endsWith(".py");
    },
    async initialize(projectId, projectName) {
      context.logger.info(`\u{1F40D} Initializing Python runtime for project: ${projectName}`);
      currentProjectId = projectId;
      await initPyodide();
      await syncFilesToPyodide(projectId);
    },
    async execute(options) {
      const { projectId, filePath } = options;
      try {
        context.logger.info(`\u{1F40D} Executing Python file: ${filePath}`);
        const fileRepository = await context.getSystemModule("fileRepository");
        await fileRepository.init();
        const file = await fileRepository.getFileByPath(projectId, filePath);
        if (!file || !file.content) {
          throw new Error(`File not found: ${filePath}`);
        }
        const result = await runPythonWithSync(file.content, projectId);
        return {
          stdout: result.stdout,
          stderr: result.stderr,
          result: result.result,
          exitCode: result.stderr ? 1 : 0
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        context.logger.error(`\u274C Python execution failed: ${errorMessage}`);
        return {
          stderr: errorMessage,
          exitCode: 1
        };
      }
    },
    async executeCode(code, options) {
      try {
        context.logger.info("\u{1F40D} Executing Python code snippet");
        const pyodide = await initPyodide();
        const result = await pyodide.runPythonAsync(code);
        return {
          result: String(result),
          exitCode: 0
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        context.logger.error(`\u274C Python code execution failed: ${errorMessage}`);
        return {
          stderr: errorMessage,
          exitCode: 1
        };
      }
    },
    isReady() {
      return pyodideInstance !== null;
    }
  });
  if (context.commands) {
    context.commands.registerCommand("python", async (args, cmdContext) => {
      try {
        if (args.length === 0) {
          return 'Usage: python <file.py> or python -c "<code>"';
        }
        if (args[0] === "-c") {
          const code = args.slice(1).join(" ");
          const result2 = await runPythonWithSync(code, cmdContext.projectId);
          return result2.stdout || result2.stderr || "";
        }
        const filePath = args[0];
        const fileRepository = await context.getSystemModule("fileRepository");
        await fileRepository.init();
        let normalizedPath = filePath;
        if (!filePath.startsWith("/")) {
          const relativeCurrent = cmdContext.currentDirectory.replace(`/projects/${cmdContext.projectName}`, "");
          normalizedPath = relativeCurrent === "" ? `/${filePath}` : `${relativeCurrent}/${filePath}`;
        } else {
          normalizedPath = filePath.replace(`/projects/${cmdContext.projectName}`, "");
        }
        const file = await fileRepository.getFileByPath(cmdContext.projectId, normalizedPath);
        if (!file || !file.content) {
          return `Error: File not found: ${normalizedPath}`;
        }
        const result = await runPythonWithSync(file.content, cmdContext.projectId);
        return result.stdout || result.stderr || "";
      } catch (error) {
        return `Error: ${error instanceof Error ? error.message : String(error)}`;
      }
    });
    context.logger.info("\u2705 Registered terminal command: python");
  }
  context.logger.info("\u2705 Python Runtime Extension activated");
  return {};
}
__name(activate, "activate");
async function deactivate() {
  console.log("[Python Runtime] Deactivating...");
}
__name(deactivate, "deactivate");
export {
  activate,
  deactivate
};
