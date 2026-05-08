var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/esbuild-wasm@0.27.0/node_modules/esbuild-wasm/lib/browser.js
var require_browser = __commonJS({
  "node_modules/.pnpm/esbuild-wasm@0.27.0/node_modules/esbuild-wasm/lib/browser.js"(exports, module) {
    ((module2) => {
      "use strict";
      var _a;
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = /* @__PURE__ */ __name((target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      }, "__export");
      var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      }, "__copyProps");
      var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
      var __async = /* @__PURE__ */ __name((__this, __arguments, generator) => {
        return new Promise((resolve, reject) => {
          var fulfilled = /* @__PURE__ */ __name((value) => {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }, "fulfilled");
          var rejected = /* @__PURE__ */ __name((value) => {
            try {
              step(generator.throw(value));
            } catch (e) {
              reject(e);
            }
          }, "rejected");
          var step = /* @__PURE__ */ __name((x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected), "step");
          step((generator = generator.apply(__this, __arguments)).next());
        });
      }, "__async");
      var browser_exports = {};
      __export(browser_exports, {
        analyzeMetafile: /* @__PURE__ */ __name(() => analyzeMetafile, "analyzeMetafile"),
        analyzeMetafileSync: /* @__PURE__ */ __name(() => analyzeMetafileSync, "analyzeMetafileSync"),
        build: /* @__PURE__ */ __name(() => build, "build"),
        buildSync: /* @__PURE__ */ __name(() => buildSync, "buildSync"),
        context: /* @__PURE__ */ __name(() => context, "context"),
        default: /* @__PURE__ */ __name(() => browser_default, "default"),
        formatMessages: /* @__PURE__ */ __name(() => formatMessages, "formatMessages"),
        formatMessagesSync: /* @__PURE__ */ __name(() => formatMessagesSync, "formatMessagesSync"),
        initialize: /* @__PURE__ */ __name(() => initialize, "initialize"),
        stop: /* @__PURE__ */ __name(() => stop, "stop"),
        transform: /* @__PURE__ */ __name(() => transform, "transform"),
        transformSync: /* @__PURE__ */ __name(() => transformSync, "transformSync"),
        version: /* @__PURE__ */ __name(() => version, "version")
      });
      module2.exports = __toCommonJS(browser_exports);
      function encodePacket(packet) {
        let visit = /* @__PURE__ */ __name((value) => {
          if (value === null) {
            bb.write8(0);
          } else if (typeof value === "boolean") {
            bb.write8(1);
            bb.write8(+value);
          } else if (typeof value === "number") {
            bb.write8(2);
            bb.write32(value | 0);
          } else if (typeof value === "string") {
            bb.write8(3);
            bb.write(encodeUTF8(value));
          } else if (value instanceof Uint8Array) {
            bb.write8(4);
            bb.write(value);
          } else if (value instanceof Array) {
            bb.write8(5);
            bb.write32(value.length);
            for (let item of value) {
              visit(item);
            }
          } else {
            let keys = Object.keys(value);
            bb.write8(6);
            bb.write32(keys.length);
            for (let key of keys) {
              bb.write(encodeUTF8(key));
              visit(value[key]);
            }
          }
        }, "visit");
        let bb = new ByteBuffer();
        bb.write32(0);
        bb.write32(packet.id << 1 | +!packet.isRequest);
        visit(packet.value);
        writeUInt32LE(bb.buf, bb.len - 4, 0);
        return bb.buf.subarray(0, bb.len);
      }
      __name(encodePacket, "encodePacket");
      function decodePacket(bytes) {
        let visit = /* @__PURE__ */ __name(() => {
          switch (bb.read8()) {
            case 0:
              return null;
            case 1:
              return !!bb.read8();
            case 2:
              return bb.read32();
            case 3:
              return decodeUTF8(bb.read());
            case 4:
              return bb.read();
            case 5: {
              let count = bb.read32();
              let value2 = [];
              for (let i = 0; i < count; i++) {
                value2.push(visit());
              }
              return value2;
            }
            case 6: {
              let count = bb.read32();
              let value2 = {};
              for (let i = 0; i < count; i++) {
                value2[decodeUTF8(bb.read())] = visit();
              }
              return value2;
            }
            default:
              throw new Error("Invalid packet");
          }
        }, "visit");
        let bb = new ByteBuffer(bytes);
        let id = bb.read32();
        let isRequest = (id & 1) === 0;
        id >>>= 1;
        let value = visit();
        if (bb.ptr !== bytes.length) {
          throw new Error("Invalid packet");
        }
        return { id, isRequest, value };
      }
      __name(decodePacket, "decodePacket");
      var ByteBuffer = (_a = class {
        constructor(buf = new Uint8Array(1024)) {
          this.buf = buf;
          this.len = 0;
          this.ptr = 0;
        }
        _write(delta) {
          if (this.len + delta > this.buf.length) {
            let clone = new Uint8Array((this.len + delta) * 2);
            clone.set(this.buf);
            this.buf = clone;
          }
          this.len += delta;
          return this.len - delta;
        }
        write8(value) {
          let offset = this._write(1);
          this.buf[offset] = value;
        }
        write32(value) {
          let offset = this._write(4);
          writeUInt32LE(this.buf, value, offset);
        }
        write(bytes) {
          let offset = this._write(4 + bytes.length);
          writeUInt32LE(this.buf, bytes.length, offset);
          this.buf.set(bytes, offset + 4);
        }
        _read(delta) {
          if (this.ptr + delta > this.buf.length) {
            throw new Error("Invalid packet");
          }
          this.ptr += delta;
          return this.ptr - delta;
        }
        read8() {
          return this.buf[this._read(1)];
        }
        read32() {
          return readUInt32LE(this.buf, this._read(4));
        }
        read() {
          let length = this.read32();
          let bytes = new Uint8Array(length);
          let ptr = this._read(bytes.length);
          bytes.set(this.buf.subarray(ptr, ptr + length));
          return bytes;
        }
      }, __name(_a, "ByteBuffer"), _a);
      var encodeUTF8;
      var decodeUTF8;
      var encodeInvariant;
      if (typeof TextEncoder !== "undefined" && typeof TextDecoder !== "undefined") {
        let encoder = new TextEncoder();
        let decoder = new TextDecoder();
        encodeUTF8 = /* @__PURE__ */ __name((text) => encoder.encode(text), "encodeUTF8");
        decodeUTF8 = /* @__PURE__ */ __name((bytes) => decoder.decode(bytes), "decodeUTF8");
        encodeInvariant = 'new TextEncoder().encode("")';
      } else if (typeof Buffer !== "undefined") {
        encodeUTF8 = /* @__PURE__ */ __name((text) => Buffer.from(text), "encodeUTF8");
        decodeUTF8 = /* @__PURE__ */ __name((bytes) => {
          let { buffer, byteOffset, byteLength } = bytes;
          return Buffer.from(buffer, byteOffset, byteLength).toString();
        }, "decodeUTF8");
        encodeInvariant = 'Buffer.from("")';
      } else {
        throw new Error("No UTF-8 codec found");
      }
      if (!(encodeUTF8("") instanceof Uint8Array))
        throw new Error(`Invariant violation: "${encodeInvariant} instanceof Uint8Array" is incorrectly false

This indicates that your JavaScript environment is broken. You cannot use
esbuild in this environment because esbuild relies on this invariant. This
is not a problem with esbuild. You need to fix your environment instead.
`);
      function readUInt32LE(buffer, offset) {
        return buffer[offset++] | buffer[offset++] << 8 | buffer[offset++] << 16 | buffer[offset++] << 24;
      }
      __name(readUInt32LE, "readUInt32LE");
      function writeUInt32LE(buffer, value, offset) {
        buffer[offset++] = value;
        buffer[offset++] = value >> 8;
        buffer[offset++] = value >> 16;
        buffer[offset++] = value >> 24;
      }
      __name(writeUInt32LE, "writeUInt32LE");
      var quote = JSON.stringify;
      var buildLogLevelDefault = "warning";
      var transformLogLevelDefault = "silent";
      function validateAndJoinStringArray(values, what) {
        const toJoin = [];
        for (const value of values) {
          validateStringValue(value, what);
          if (value.indexOf(",") >= 0) throw new Error(`Invalid ${what}: ${value}`);
          toJoin.push(value);
        }
        return toJoin.join(",");
      }
      __name(validateAndJoinStringArray, "validateAndJoinStringArray");
      var canBeAnything = /* @__PURE__ */ __name(() => null, "canBeAnything");
      var mustBeBoolean = /* @__PURE__ */ __name((value) => typeof value === "boolean" ? null : "a boolean", "mustBeBoolean");
      var mustBeString = /* @__PURE__ */ __name((value) => typeof value === "string" ? null : "a string", "mustBeString");
      var mustBeRegExp = /* @__PURE__ */ __name((value) => value instanceof RegExp ? null : "a RegExp object", "mustBeRegExp");
      var mustBeInteger = /* @__PURE__ */ __name((value) => typeof value === "number" && value === (value | 0) ? null : "an integer", "mustBeInteger");
      var mustBeValidPortNumber = /* @__PURE__ */ __name((value) => typeof value === "number" && value === (value | 0) && value >= 0 && value <= 65535 ? null : "a valid port number", "mustBeValidPortNumber");
      var mustBeFunction = /* @__PURE__ */ __name((value) => typeof value === "function" ? null : "a function", "mustBeFunction");
      var mustBeArray = /* @__PURE__ */ __name((value) => Array.isArray(value) ? null : "an array", "mustBeArray");
      var mustBeArrayOfStrings = /* @__PURE__ */ __name((value) => Array.isArray(value) && value.every((x) => typeof x === "string") ? null : "an array of strings", "mustBeArrayOfStrings");
      var mustBeObject = /* @__PURE__ */ __name((value) => typeof value === "object" && value !== null && !Array.isArray(value) ? null : "an object", "mustBeObject");
      var mustBeEntryPoints = /* @__PURE__ */ __name((value) => typeof value === "object" && value !== null ? null : "an array or an object", "mustBeEntryPoints");
      var mustBeWebAssemblyModule = /* @__PURE__ */ __name((value) => value instanceof WebAssembly.Module ? null : "a WebAssembly.Module", "mustBeWebAssemblyModule");
      var mustBeObjectOrNull = /* @__PURE__ */ __name((value) => typeof value === "object" && !Array.isArray(value) ? null : "an object or null", "mustBeObjectOrNull");
      var mustBeStringOrBoolean = /* @__PURE__ */ __name((value) => typeof value === "string" || typeof value === "boolean" ? null : "a string or a boolean", "mustBeStringOrBoolean");
      var mustBeStringOrObject = /* @__PURE__ */ __name((value) => typeof value === "string" || typeof value === "object" && value !== null && !Array.isArray(value) ? null : "a string or an object", "mustBeStringOrObject");
      var mustBeStringOrArrayOfStrings = /* @__PURE__ */ __name((value) => typeof value === "string" || Array.isArray(value) && value.every((x) => typeof x === "string") ? null : "a string or an array of strings", "mustBeStringOrArrayOfStrings");
      var mustBeStringOrUint8Array = /* @__PURE__ */ __name((value) => typeof value === "string" || value instanceof Uint8Array ? null : "a string or a Uint8Array", "mustBeStringOrUint8Array");
      var mustBeStringOrURL = /* @__PURE__ */ __name((value) => typeof value === "string" || value instanceof URL ? null : "a string or a URL", "mustBeStringOrURL");
      function getFlag(object, keys, key, mustBeFn) {
        let value = object[key];
        keys[key + ""] = true;
        if (value === void 0) return void 0;
        let mustBe = mustBeFn(value);
        if (mustBe !== null) throw new Error(`${quote(key)} must be ${mustBe}`);
        return value;
      }
      __name(getFlag, "getFlag");
      function checkForInvalidFlags(object, keys, where) {
        for (let key in object) {
          if (!(key in keys)) {
            throw new Error(`Invalid option ${where}: ${quote(key)}`);
          }
        }
      }
      __name(checkForInvalidFlags, "checkForInvalidFlags");
      function validateInitializeOptions(options) {
        let keys = /* @__PURE__ */ Object.create(null);
        let wasmURL = getFlag(options, keys, "wasmURL", mustBeStringOrURL);
        let wasmModule = getFlag(options, keys, "wasmModule", mustBeWebAssemblyModule);
        let worker = getFlag(options, keys, "worker", mustBeBoolean);
        checkForInvalidFlags(options, keys, "in initialize() call");
        return {
          wasmURL,
          wasmModule,
          worker
        };
      }
      __name(validateInitializeOptions, "validateInitializeOptions");
      function validateMangleCache(mangleCache) {
        let validated;
        if (mangleCache !== void 0) {
          validated = /* @__PURE__ */ Object.create(null);
          for (let key in mangleCache) {
            let value = mangleCache[key];
            if (typeof value === "string" || value === false) {
              validated[key] = value;
            } else {
              throw new Error(`Expected ${quote(key)} in mangle cache to map to either a string or false`);
            }
          }
        }
        return validated;
      }
      __name(validateMangleCache, "validateMangleCache");
      function pushLogFlags(flags, options, keys, isTTY, logLevelDefault) {
        let color = getFlag(options, keys, "color", mustBeBoolean);
        let logLevel = getFlag(options, keys, "logLevel", mustBeString);
        let logLimit = getFlag(options, keys, "logLimit", mustBeInteger);
        if (color !== void 0) flags.push(`--color=${color}`);
        else if (isTTY) flags.push(`--color=true`);
        flags.push(`--log-level=${logLevel || logLevelDefault}`);
        flags.push(`--log-limit=${logLimit || 0}`);
      }
      __name(pushLogFlags, "pushLogFlags");
      function validateStringValue(value, what, key) {
        if (typeof value !== "string") {
          throw new Error(`Expected value for ${what}${key !== void 0 ? " " + quote(key) : ""} to be a string, got ${typeof value} instead`);
        }
        return value;
      }
      __name(validateStringValue, "validateStringValue");
      function pushCommonFlags(flags, options, keys) {
        let legalComments = getFlag(options, keys, "legalComments", mustBeString);
        let sourceRoot = getFlag(options, keys, "sourceRoot", mustBeString);
        let sourcesContent = getFlag(options, keys, "sourcesContent", mustBeBoolean);
        let target = getFlag(options, keys, "target", mustBeStringOrArrayOfStrings);
        let format = getFlag(options, keys, "format", mustBeString);
        let globalName = getFlag(options, keys, "globalName", mustBeString);
        let mangleProps = getFlag(options, keys, "mangleProps", mustBeRegExp);
        let reserveProps = getFlag(options, keys, "reserveProps", mustBeRegExp);
        let mangleQuoted = getFlag(options, keys, "mangleQuoted", mustBeBoolean);
        let minify = getFlag(options, keys, "minify", mustBeBoolean);
        let minifySyntax = getFlag(options, keys, "minifySyntax", mustBeBoolean);
        let minifyWhitespace = getFlag(options, keys, "minifyWhitespace", mustBeBoolean);
        let minifyIdentifiers = getFlag(options, keys, "minifyIdentifiers", mustBeBoolean);
        let lineLimit = getFlag(options, keys, "lineLimit", mustBeInteger);
        let drop = getFlag(options, keys, "drop", mustBeArrayOfStrings);
        let dropLabels = getFlag(options, keys, "dropLabels", mustBeArrayOfStrings);
        let charset = getFlag(options, keys, "charset", mustBeString);
        let treeShaking = getFlag(options, keys, "treeShaking", mustBeBoolean);
        let ignoreAnnotations = getFlag(options, keys, "ignoreAnnotations", mustBeBoolean);
        let jsx = getFlag(options, keys, "jsx", mustBeString);
        let jsxFactory = getFlag(options, keys, "jsxFactory", mustBeString);
        let jsxFragment = getFlag(options, keys, "jsxFragment", mustBeString);
        let jsxImportSource = getFlag(options, keys, "jsxImportSource", mustBeString);
        let jsxDev = getFlag(options, keys, "jsxDev", mustBeBoolean);
        let jsxSideEffects = getFlag(options, keys, "jsxSideEffects", mustBeBoolean);
        let define = getFlag(options, keys, "define", mustBeObject);
        let logOverride = getFlag(options, keys, "logOverride", mustBeObject);
        let supported = getFlag(options, keys, "supported", mustBeObject);
        let pure = getFlag(options, keys, "pure", mustBeArrayOfStrings);
        let keepNames = getFlag(options, keys, "keepNames", mustBeBoolean);
        let platform = getFlag(options, keys, "platform", mustBeString);
        let tsconfigRaw = getFlag(options, keys, "tsconfigRaw", mustBeStringOrObject);
        let absPaths = getFlag(options, keys, "absPaths", mustBeArrayOfStrings);
        if (legalComments) flags.push(`--legal-comments=${legalComments}`);
        if (sourceRoot !== void 0) flags.push(`--source-root=${sourceRoot}`);
        if (sourcesContent !== void 0) flags.push(`--sources-content=${sourcesContent}`);
        if (target) flags.push(`--target=${validateAndJoinStringArray(Array.isArray(target) ? target : [target], "target")}`);
        if (format) flags.push(`--format=${format}`);
        if (globalName) flags.push(`--global-name=${globalName}`);
        if (platform) flags.push(`--platform=${platform}`);
        if (tsconfigRaw) flags.push(`--tsconfig-raw=${typeof tsconfigRaw === "string" ? tsconfigRaw : JSON.stringify(tsconfigRaw)}`);
        if (minify) flags.push("--minify");
        if (minifySyntax) flags.push("--minify-syntax");
        if (minifyWhitespace) flags.push("--minify-whitespace");
        if (minifyIdentifiers) flags.push("--minify-identifiers");
        if (lineLimit) flags.push(`--line-limit=${lineLimit}`);
        if (charset) flags.push(`--charset=${charset}`);
        if (treeShaking !== void 0) flags.push(`--tree-shaking=${treeShaking}`);
        if (ignoreAnnotations) flags.push(`--ignore-annotations`);
        if (drop) for (let what of drop) flags.push(`--drop:${validateStringValue(what, "drop")}`);
        if (dropLabels) flags.push(`--drop-labels=${validateAndJoinStringArray(dropLabels, "drop label")}`);
        if (absPaths) flags.push(`--abs-paths=${validateAndJoinStringArray(absPaths, "abs paths")}`);
        if (mangleProps) flags.push(`--mangle-props=${jsRegExpToGoRegExp(mangleProps)}`);
        if (reserveProps) flags.push(`--reserve-props=${jsRegExpToGoRegExp(reserveProps)}`);
        if (mangleQuoted !== void 0) flags.push(`--mangle-quoted=${mangleQuoted}`);
        if (jsx) flags.push(`--jsx=${jsx}`);
        if (jsxFactory) flags.push(`--jsx-factory=${jsxFactory}`);
        if (jsxFragment) flags.push(`--jsx-fragment=${jsxFragment}`);
        if (jsxImportSource) flags.push(`--jsx-import-source=${jsxImportSource}`);
        if (jsxDev) flags.push(`--jsx-dev`);
        if (jsxSideEffects) flags.push(`--jsx-side-effects`);
        if (define) {
          for (let key in define) {
            if (key.indexOf("=") >= 0) throw new Error(`Invalid define: ${key}`);
            flags.push(`--define:${key}=${validateStringValue(define[key], "define", key)}`);
          }
        }
        if (logOverride) {
          for (let key in logOverride) {
            if (key.indexOf("=") >= 0) throw new Error(`Invalid log override: ${key}`);
            flags.push(`--log-override:${key}=${validateStringValue(logOverride[key], "log override", key)}`);
          }
        }
        if (supported) {
          for (let key in supported) {
            if (key.indexOf("=") >= 0) throw new Error(`Invalid supported: ${key}`);
            const value = supported[key];
            if (typeof value !== "boolean") throw new Error(`Expected value for supported ${quote(key)} to be a boolean, got ${typeof value} instead`);
            flags.push(`--supported:${key}=${value}`);
          }
        }
        if (pure) for (let fn of pure) flags.push(`--pure:${validateStringValue(fn, "pure")}`);
        if (keepNames) flags.push(`--keep-names`);
      }
      __name(pushCommonFlags, "pushCommonFlags");
      function flagsForBuildOptions(callName, options, isTTY, logLevelDefault, writeDefault) {
        var _a2;
        let flags = [];
        let entries = [];
        let keys = /* @__PURE__ */ Object.create(null);
        let stdinContents = null;
        let stdinResolveDir = null;
        pushLogFlags(flags, options, keys, isTTY, logLevelDefault);
        pushCommonFlags(flags, options, keys);
        let sourcemap = getFlag(options, keys, "sourcemap", mustBeStringOrBoolean);
        let bundle = getFlag(options, keys, "bundle", mustBeBoolean);
        let splitting = getFlag(options, keys, "splitting", mustBeBoolean);
        let preserveSymlinks = getFlag(options, keys, "preserveSymlinks", mustBeBoolean);
        let metafile = getFlag(options, keys, "metafile", mustBeBoolean);
        let outfile = getFlag(options, keys, "outfile", mustBeString);
        let outdir = getFlag(options, keys, "outdir", mustBeString);
        let outbase = getFlag(options, keys, "outbase", mustBeString);
        let tsconfig = getFlag(options, keys, "tsconfig", mustBeString);
        let resolveExtensions = getFlag(options, keys, "resolveExtensions", mustBeArrayOfStrings);
        let nodePathsInput = getFlag(options, keys, "nodePaths", mustBeArrayOfStrings);
        let mainFields = getFlag(options, keys, "mainFields", mustBeArrayOfStrings);
        let conditions = getFlag(options, keys, "conditions", mustBeArrayOfStrings);
        let external = getFlag(options, keys, "external", mustBeArrayOfStrings);
        let packages = getFlag(options, keys, "packages", mustBeString);
        let alias = getFlag(options, keys, "alias", mustBeObject);
        let loader = getFlag(options, keys, "loader", mustBeObject);
        let outExtension = getFlag(options, keys, "outExtension", mustBeObject);
        let publicPath = getFlag(options, keys, "publicPath", mustBeString);
        let entryNames = getFlag(options, keys, "entryNames", mustBeString);
        let chunkNames = getFlag(options, keys, "chunkNames", mustBeString);
        let assetNames = getFlag(options, keys, "assetNames", mustBeString);
        let inject = getFlag(options, keys, "inject", mustBeArrayOfStrings);
        let banner = getFlag(options, keys, "banner", mustBeObject);
        let footer = getFlag(options, keys, "footer", mustBeObject);
        let entryPoints = getFlag(options, keys, "entryPoints", mustBeEntryPoints);
        let absWorkingDir = getFlag(options, keys, "absWorkingDir", mustBeString);
        let stdin = getFlag(options, keys, "stdin", mustBeObject);
        let write = (_a2 = getFlag(options, keys, "write", mustBeBoolean)) != null ? _a2 : writeDefault;
        let allowOverwrite = getFlag(options, keys, "allowOverwrite", mustBeBoolean);
        let mangleCache = getFlag(options, keys, "mangleCache", mustBeObject);
        keys.plugins = true;
        checkForInvalidFlags(options, keys, `in ${callName}() call`);
        if (sourcemap) flags.push(`--sourcemap${sourcemap === true ? "" : `=${sourcemap}`}`);
        if (bundle) flags.push("--bundle");
        if (allowOverwrite) flags.push("--allow-overwrite");
        if (splitting) flags.push("--splitting");
        if (preserveSymlinks) flags.push("--preserve-symlinks");
        if (metafile) flags.push(`--metafile`);
        if (outfile) flags.push(`--outfile=${outfile}`);
        if (outdir) flags.push(`--outdir=${outdir}`);
        if (outbase) flags.push(`--outbase=${outbase}`);
        if (tsconfig) flags.push(`--tsconfig=${tsconfig}`);
        if (packages) flags.push(`--packages=${packages}`);
        if (resolveExtensions) flags.push(`--resolve-extensions=${validateAndJoinStringArray(resolveExtensions, "resolve extension")}`);
        if (publicPath) flags.push(`--public-path=${publicPath}`);
        if (entryNames) flags.push(`--entry-names=${entryNames}`);
        if (chunkNames) flags.push(`--chunk-names=${chunkNames}`);
        if (assetNames) flags.push(`--asset-names=${assetNames}`);
        if (mainFields) flags.push(`--main-fields=${validateAndJoinStringArray(mainFields, "main field")}`);
        if (conditions) flags.push(`--conditions=${validateAndJoinStringArray(conditions, "condition")}`);
        if (external) for (let name of external) flags.push(`--external:${validateStringValue(name, "external")}`);
        if (alias) {
          for (let old in alias) {
            if (old.indexOf("=") >= 0) throw new Error(`Invalid package name in alias: ${old}`);
            flags.push(`--alias:${old}=${validateStringValue(alias[old], "alias", old)}`);
          }
        }
        if (banner) {
          for (let type in banner) {
            if (type.indexOf("=") >= 0) throw new Error(`Invalid banner file type: ${type}`);
            flags.push(`--banner:${type}=${validateStringValue(banner[type], "banner", type)}`);
          }
        }
        if (footer) {
          for (let type in footer) {
            if (type.indexOf("=") >= 0) throw new Error(`Invalid footer file type: ${type}`);
            flags.push(`--footer:${type}=${validateStringValue(footer[type], "footer", type)}`);
          }
        }
        if (inject) for (let path of inject) flags.push(`--inject:${validateStringValue(path, "inject")}`);
        if (loader) {
          for (let ext in loader) {
            if (ext.indexOf("=") >= 0) throw new Error(`Invalid loader extension: ${ext}`);
            flags.push(`--loader:${ext}=${validateStringValue(loader[ext], "loader", ext)}`);
          }
        }
        if (outExtension) {
          for (let ext in outExtension) {
            if (ext.indexOf("=") >= 0) throw new Error(`Invalid out extension: ${ext}`);
            flags.push(`--out-extension:${ext}=${validateStringValue(outExtension[ext], "out extension", ext)}`);
          }
        }
        if (entryPoints) {
          if (Array.isArray(entryPoints)) {
            for (let i = 0, n = entryPoints.length; i < n; i++) {
              let entryPoint = entryPoints[i];
              if (typeof entryPoint === "object" && entryPoint !== null) {
                let entryPointKeys = /* @__PURE__ */ Object.create(null);
                let input = getFlag(entryPoint, entryPointKeys, "in", mustBeString);
                let output = getFlag(entryPoint, entryPointKeys, "out", mustBeString);
                checkForInvalidFlags(entryPoint, entryPointKeys, "in entry point at index " + i);
                if (input === void 0) throw new Error('Missing property "in" for entry point at index ' + i);
                if (output === void 0) throw new Error('Missing property "out" for entry point at index ' + i);
                entries.push([output, input]);
              } else {
                entries.push(["", validateStringValue(entryPoint, "entry point at index " + i)]);
              }
            }
          } else {
            for (let key in entryPoints) {
              entries.push([key, validateStringValue(entryPoints[key], "entry point", key)]);
            }
          }
        }
        if (stdin) {
          let stdinKeys = /* @__PURE__ */ Object.create(null);
          let contents = getFlag(stdin, stdinKeys, "contents", mustBeStringOrUint8Array);
          let resolveDir = getFlag(stdin, stdinKeys, "resolveDir", mustBeString);
          let sourcefile = getFlag(stdin, stdinKeys, "sourcefile", mustBeString);
          let loader2 = getFlag(stdin, stdinKeys, "loader", mustBeString);
          checkForInvalidFlags(stdin, stdinKeys, 'in "stdin" object');
          if (sourcefile) flags.push(`--sourcefile=${sourcefile}`);
          if (loader2) flags.push(`--loader=${loader2}`);
          if (resolveDir) stdinResolveDir = resolveDir;
          if (typeof contents === "string") stdinContents = encodeUTF8(contents);
          else if (contents instanceof Uint8Array) stdinContents = contents;
        }
        let nodePaths = [];
        if (nodePathsInput) {
          for (let value of nodePathsInput) {
            value += "";
            nodePaths.push(value);
          }
        }
        return {
          entries,
          flags,
          write,
          stdinContents,
          stdinResolveDir,
          absWorkingDir,
          nodePaths,
          mangleCache: validateMangleCache(mangleCache)
        };
      }
      __name(flagsForBuildOptions, "flagsForBuildOptions");
      function flagsForTransformOptions(callName, options, isTTY, logLevelDefault) {
        let flags = [];
        let keys = /* @__PURE__ */ Object.create(null);
        pushLogFlags(flags, options, keys, isTTY, logLevelDefault);
        pushCommonFlags(flags, options, keys);
        let sourcemap = getFlag(options, keys, "sourcemap", mustBeStringOrBoolean);
        let sourcefile = getFlag(options, keys, "sourcefile", mustBeString);
        let loader = getFlag(options, keys, "loader", mustBeString);
        let banner = getFlag(options, keys, "banner", mustBeString);
        let footer = getFlag(options, keys, "footer", mustBeString);
        let mangleCache = getFlag(options, keys, "mangleCache", mustBeObject);
        checkForInvalidFlags(options, keys, `in ${callName}() call`);
        if (sourcemap) flags.push(`--sourcemap=${sourcemap === true ? "external" : sourcemap}`);
        if (sourcefile) flags.push(`--sourcefile=${sourcefile}`);
        if (loader) flags.push(`--loader=${loader}`);
        if (banner) flags.push(`--banner=${banner}`);
        if (footer) flags.push(`--footer=${footer}`);
        return {
          flags,
          mangleCache: validateMangleCache(mangleCache)
        };
      }
      __name(flagsForTransformOptions, "flagsForTransformOptions");
      function createChannel(streamIn) {
        const requestCallbacksByKey = {};
        const closeData = { didClose: false, reason: "" };
        let responseCallbacks = {};
        let nextRequestID = 0;
        let nextBuildKey = 0;
        let stdout = new Uint8Array(16 * 1024);
        let stdoutUsed = 0;
        let readFromStdout = /* @__PURE__ */ __name((chunk) => {
          let limit = stdoutUsed + chunk.length;
          if (limit > stdout.length) {
            let swap = new Uint8Array(limit * 2);
            swap.set(stdout);
            stdout = swap;
          }
          stdout.set(chunk, stdoutUsed);
          stdoutUsed += chunk.length;
          let offset = 0;
          while (offset + 4 <= stdoutUsed) {
            let length = readUInt32LE(stdout, offset);
            if (offset + 4 + length > stdoutUsed) {
              break;
            }
            offset += 4;
            handleIncomingPacket(stdout.subarray(offset, offset + length));
            offset += length;
          }
          if (offset > 0) {
            stdout.copyWithin(0, offset, stdoutUsed);
            stdoutUsed -= offset;
          }
        }, "readFromStdout");
        let afterClose = /* @__PURE__ */ __name((error) => {
          closeData.didClose = true;
          if (error) closeData.reason = ": " + (error.message || error);
          const text = "The service was stopped" + closeData.reason;
          for (let id in responseCallbacks) {
            responseCallbacks[id](text, null);
          }
          responseCallbacks = {};
        }, "afterClose");
        let sendRequest = /* @__PURE__ */ __name((refs, value, callback) => {
          if (closeData.didClose) return callback("The service is no longer running" + closeData.reason, null);
          let id = nextRequestID++;
          responseCallbacks[id] = (error, response) => {
            try {
              callback(error, response);
            } finally {
              if (refs) refs.unref();
            }
          };
          if (refs) refs.ref();
          streamIn.writeToStdin(encodePacket({ id, isRequest: true, value }));
        }, "sendRequest");
        let sendResponse = /* @__PURE__ */ __name((id, value) => {
          if (closeData.didClose) throw new Error("The service is no longer running" + closeData.reason);
          streamIn.writeToStdin(encodePacket({ id, isRequest: false, value }));
        }, "sendResponse");
        let handleRequest = /* @__PURE__ */ __name((id, request) => __async(null, null, function* () {
          try {
            if (request.command === "ping") {
              sendResponse(id, {});
              return;
            }
            if (typeof request.key === "number") {
              const requestCallbacks = requestCallbacksByKey[request.key];
              if (!requestCallbacks) {
                return;
              }
              const callback = requestCallbacks[request.command];
              if (callback) {
                yield callback(id, request);
                return;
              }
            }
            throw new Error(`Invalid command: ` + request.command);
          } catch (e) {
            const errors = [extractErrorMessageV8(e, streamIn, null, void 0, "")];
            try {
              sendResponse(id, { errors });
            } catch (e2) {
            }
          }
        }), "handleRequest");
        let isFirstPacket = true;
        let handleIncomingPacket = /* @__PURE__ */ __name((bytes) => {
          if (isFirstPacket) {
            isFirstPacket = false;
            let binaryVersion = String.fromCharCode(...bytes);
            if (binaryVersion !== "0.27.0") {
              throw new Error(`Cannot start service: Host version "${"0.27.0"}" does not match binary version ${quote(binaryVersion)}`);
            }
            return;
          }
          let packet = decodePacket(bytes);
          if (packet.isRequest) {
            handleRequest(packet.id, packet.value);
          } else {
            let callback = responseCallbacks[packet.id];
            delete responseCallbacks[packet.id];
            if (packet.value.error) callback(packet.value.error, {});
            else callback(null, packet.value);
          }
        }, "handleIncomingPacket");
        let buildOrContext = /* @__PURE__ */ __name(({ callName, refs, options, isTTY, defaultWD, callback }) => {
          let refCount = 0;
          const buildKey = nextBuildKey++;
          const requestCallbacks = {};
          const buildRefs = {
            ref() {
              if (++refCount === 1) {
                if (refs) refs.ref();
              }
            },
            unref() {
              if (--refCount === 0) {
                delete requestCallbacksByKey[buildKey];
                if (refs) refs.unref();
              }
            }
          };
          requestCallbacksByKey[buildKey] = requestCallbacks;
          buildRefs.ref();
          buildOrContextImpl(
            callName,
            buildKey,
            sendRequest,
            sendResponse,
            buildRefs,
            streamIn,
            requestCallbacks,
            options,
            isTTY,
            defaultWD,
            (err, res) => {
              try {
                callback(err, res);
              } finally {
                buildRefs.unref();
              }
            }
          );
        }, "buildOrContext");
        let transform2 = /* @__PURE__ */ __name(({ callName, refs, input, options, isTTY, fs, callback }) => {
          const details = createObjectStash();
          let start = /* @__PURE__ */ __name((inputPath) => {
            try {
              if (typeof input !== "string" && !(input instanceof Uint8Array))
                throw new Error('The input to "transform" must be a string or a Uint8Array');
              let {
                flags,
                mangleCache
              } = flagsForTransformOptions(callName, options, isTTY, transformLogLevelDefault);
              let request = {
                command: "transform",
                flags,
                inputFS: inputPath !== null,
                input: inputPath !== null ? encodeUTF8(inputPath) : typeof input === "string" ? encodeUTF8(input) : input
              };
              if (mangleCache) request.mangleCache = mangleCache;
              sendRequest(refs, request, (error, response) => {
                if (error) return callback(new Error(error), null);
                let errors = replaceDetailsInMessages(response.errors, details);
                let warnings = replaceDetailsInMessages(response.warnings, details);
                let outstanding = 1;
                let next = /* @__PURE__ */ __name(() => {
                  if (--outstanding === 0) {
                    let result = {
                      warnings,
                      code: response.code,
                      map: response.map,
                      mangleCache: void 0,
                      legalComments: void 0
                    };
                    if ("legalComments" in response) result.legalComments = response == null ? void 0 : response.legalComments;
                    if (response.mangleCache) result.mangleCache = response == null ? void 0 : response.mangleCache;
                    callback(null, result);
                  }
                }, "next");
                if (errors.length > 0) return callback(failureErrorWithLog("Transform failed", errors, warnings), null);
                if (response.codeFS) {
                  outstanding++;
                  fs.readFile(response.code, (err, contents) => {
                    if (err !== null) {
                      callback(err, null);
                    } else {
                      response.code = contents;
                      next();
                    }
                  });
                }
                if (response.mapFS) {
                  outstanding++;
                  fs.readFile(response.map, (err, contents) => {
                    if (err !== null) {
                      callback(err, null);
                    } else {
                      response.map = contents;
                      next();
                    }
                  });
                }
                next();
              });
            } catch (e) {
              let flags = [];
              try {
                pushLogFlags(flags, options, {}, isTTY, transformLogLevelDefault);
              } catch (e2) {
              }
              const error = extractErrorMessageV8(e, streamIn, details, void 0, "");
              sendRequest(refs, { command: "error", flags, error }, () => {
                error.detail = details.load(error.detail);
                callback(failureErrorWithLog("Transform failed", [error], []), null);
              });
            }
          }, "start");
          if ((typeof input === "string" || input instanceof Uint8Array) && input.length > 1024 * 1024) {
            let next = start;
            start = /* @__PURE__ */ __name(() => fs.writeFile(input, next), "start");
          }
          start(null);
        }, "transform2");
        let formatMessages2 = /* @__PURE__ */ __name(({ callName, refs, messages, options, callback }) => {
          if (!options) throw new Error(`Missing second argument in ${callName}() call`);
          let keys = {};
          let kind = getFlag(options, keys, "kind", mustBeString);
          let color = getFlag(options, keys, "color", mustBeBoolean);
          let terminalWidth = getFlag(options, keys, "terminalWidth", mustBeInteger);
          checkForInvalidFlags(options, keys, `in ${callName}() call`);
          if (kind === void 0) throw new Error(`Missing "kind" in ${callName}() call`);
          if (kind !== "error" && kind !== "warning") throw new Error(`Expected "kind" to be "error" or "warning" in ${callName}() call`);
          let request = {
            command: "format-msgs",
            messages: sanitizeMessages(messages, "messages", null, "", terminalWidth),
            isWarning: kind === "warning"
          };
          if (color !== void 0) request.color = color;
          if (terminalWidth !== void 0) request.terminalWidth = terminalWidth;
          sendRequest(refs, request, (error, response) => {
            if (error) return callback(new Error(error), null);
            callback(null, response.messages);
          });
        }, "formatMessages2");
        let analyzeMetafile2 = /* @__PURE__ */ __name(({ callName, refs, metafile, options, callback }) => {
          if (options === void 0) options = {};
          let keys = {};
          let color = getFlag(options, keys, "color", mustBeBoolean);
          let verbose = getFlag(options, keys, "verbose", mustBeBoolean);
          checkForInvalidFlags(options, keys, `in ${callName}() call`);
          let request = {
            command: "analyze-metafile",
            metafile
          };
          if (color !== void 0) request.color = color;
          if (verbose !== void 0) request.verbose = verbose;
          sendRequest(refs, request, (error, response) => {
            if (error) return callback(new Error(error), null);
            callback(null, response.result);
          });
        }, "analyzeMetafile2");
        return {
          readFromStdout,
          afterClose,
          service: {
            buildOrContext,
            transform: transform2,
            formatMessages: formatMessages2,
            analyzeMetafile: analyzeMetafile2
          }
        };
      }
      __name(createChannel, "createChannel");
      function buildOrContextImpl(callName, buildKey, sendRequest, sendResponse, refs, streamIn, requestCallbacks, options, isTTY, defaultWD, callback) {
        const details = createObjectStash();
        const isContext = callName === "context";
        const handleError = /* @__PURE__ */ __name((e, pluginName) => {
          const flags = [];
          try {
            pushLogFlags(flags, options, {}, isTTY, buildLogLevelDefault);
          } catch (e2) {
          }
          const message = extractErrorMessageV8(e, streamIn, details, void 0, pluginName);
          sendRequest(refs, { command: "error", flags, error: message }, () => {
            message.detail = details.load(message.detail);
            callback(failureErrorWithLog(isContext ? "Context failed" : "Build failed", [message], []), null);
          });
        }, "handleError");
        let plugins;
        if (typeof options === "object") {
          const value = options.plugins;
          if (value !== void 0) {
            if (!Array.isArray(value)) return handleError(new Error(`"plugins" must be an array`), "");
            plugins = value;
          }
        }
        if (plugins && plugins.length > 0) {
          if (streamIn.isSync) return handleError(new Error("Cannot use plugins in synchronous API calls"), "");
          handlePlugins(
            buildKey,
            sendRequest,
            sendResponse,
            refs,
            streamIn,
            requestCallbacks,
            options,
            plugins,
            details
          ).then(
            (result) => {
              if (!result.ok) return handleError(result.error, result.pluginName);
              try {
                buildOrContextContinue(result.requestPlugins, result.runOnEndCallbacks, result.scheduleOnDisposeCallbacks);
              } catch (e) {
                handleError(e, "");
              }
            },
            (e) => handleError(e, "")
          );
          return;
        }
        try {
          buildOrContextContinue(null, (result, done) => done([], []), () => {
          });
        } catch (e) {
          handleError(e, "");
        }
        function buildOrContextContinue(requestPlugins, runOnEndCallbacks, scheduleOnDisposeCallbacks) {
          const writeDefault = streamIn.hasFS;
          const {
            entries,
            flags,
            write,
            stdinContents,
            stdinResolveDir,
            absWorkingDir,
            nodePaths,
            mangleCache
          } = flagsForBuildOptions(callName, options, isTTY, buildLogLevelDefault, writeDefault);
          if (write && !streamIn.hasFS) throw new Error(`The "write" option is unavailable in this environment`);
          const request = {
            command: "build",
            key: buildKey,
            entries,
            flags,
            write,
            stdinContents,
            stdinResolveDir,
            absWorkingDir: absWorkingDir || defaultWD,
            nodePaths,
            context: isContext
          };
          if (requestPlugins) request.plugins = requestPlugins;
          if (mangleCache) request.mangleCache = mangleCache;
          const buildResponseToResult = /* @__PURE__ */ __name((response, callback2) => {
            const result = {
              errors: replaceDetailsInMessages(response.errors, details),
              warnings: replaceDetailsInMessages(response.warnings, details),
              outputFiles: void 0,
              metafile: void 0,
              mangleCache: void 0
            };
            const originalErrors = result.errors.slice();
            const originalWarnings = result.warnings.slice();
            if (response.outputFiles) result.outputFiles = response.outputFiles.map(convertOutputFiles);
            if (response.metafile) result.metafile = JSON.parse(response.metafile);
            if (response.mangleCache) result.mangleCache = response.mangleCache;
            if (response.writeToStdout !== void 0) console.log(decodeUTF8(response.writeToStdout).replace(/\n$/, ""));
            runOnEndCallbacks(result, (onEndErrors, onEndWarnings) => {
              if (originalErrors.length > 0 || onEndErrors.length > 0) {
                const error = failureErrorWithLog("Build failed", originalErrors.concat(onEndErrors), originalWarnings.concat(onEndWarnings));
                return callback2(error, null, onEndErrors, onEndWarnings);
              }
              callback2(null, result, onEndErrors, onEndWarnings);
            });
          }, "buildResponseToResult");
          let latestResultPromise;
          let provideLatestResult;
          if (isContext)
            requestCallbacks["on-end"] = (id, request2) => new Promise((resolve) => {
              buildResponseToResult(request2, (err, result, onEndErrors, onEndWarnings) => {
                const response = {
                  errors: onEndErrors,
                  warnings: onEndWarnings
                };
                if (provideLatestResult) provideLatestResult(err, result);
                latestResultPromise = void 0;
                provideLatestResult = void 0;
                sendResponse(id, response);
                resolve();
              });
            });
          sendRequest(refs, request, (error, response) => {
            if (error) return callback(new Error(error), null);
            if (!isContext) {
              return buildResponseToResult(response, (err, res) => {
                scheduleOnDisposeCallbacks();
                return callback(err, res);
              });
            }
            if (response.errors.length > 0) {
              return callback(failureErrorWithLog("Context failed", response.errors, response.warnings), null);
            }
            let didDispose = false;
            const result = {
              rebuild: /* @__PURE__ */ __name(() => {
                if (!latestResultPromise) latestResultPromise = new Promise((resolve, reject) => {
                  let settlePromise;
                  provideLatestResult = /* @__PURE__ */ __name((err, result2) => {
                    if (!settlePromise) settlePromise = /* @__PURE__ */ __name(() => err ? reject(err) : resolve(result2), "settlePromise");
                  }, "provideLatestResult");
                  const triggerAnotherBuild = /* @__PURE__ */ __name(() => {
                    const request2 = {
                      command: "rebuild",
                      key: buildKey
                    };
                    sendRequest(refs, request2, (error2, response2) => {
                      if (error2) {
                        reject(new Error(error2));
                      } else if (settlePromise) {
                        settlePromise();
                      } else {
                        triggerAnotherBuild();
                      }
                    });
                  }, "triggerAnotherBuild");
                  triggerAnotherBuild();
                });
                return latestResultPromise;
              }, "rebuild"),
              watch: /* @__PURE__ */ __name((options2 = {}) => new Promise((resolve, reject) => {
                if (!streamIn.hasFS) throw new Error(`Cannot use the "watch" API in this environment`);
                const keys = {};
                const delay = getFlag(options2, keys, "delay", mustBeInteger);
                checkForInvalidFlags(options2, keys, `in watch() call`);
                const request2 = {
                  command: "watch",
                  key: buildKey
                };
                if (delay) request2.delay = delay;
                sendRequest(refs, request2, (error2) => {
                  if (error2) reject(new Error(error2));
                  else resolve(void 0);
                });
              }), "watch"),
              serve: /* @__PURE__ */ __name((options2 = {}) => new Promise((resolve, reject) => {
                if (!streamIn.hasFS) throw new Error(`Cannot use the "serve" API in this environment`);
                const keys = {};
                const port = getFlag(options2, keys, "port", mustBeValidPortNumber);
                const host = getFlag(options2, keys, "host", mustBeString);
                const servedir = getFlag(options2, keys, "servedir", mustBeString);
                const keyfile = getFlag(options2, keys, "keyfile", mustBeString);
                const certfile = getFlag(options2, keys, "certfile", mustBeString);
                const fallback = getFlag(options2, keys, "fallback", mustBeString);
                const cors = getFlag(options2, keys, "cors", mustBeObject);
                const onRequest = getFlag(options2, keys, "onRequest", mustBeFunction);
                checkForInvalidFlags(options2, keys, `in serve() call`);
                const request2 = {
                  command: "serve",
                  key: buildKey,
                  onRequest: !!onRequest
                };
                if (port !== void 0) request2.port = port;
                if (host !== void 0) request2.host = host;
                if (servedir !== void 0) request2.servedir = servedir;
                if (keyfile !== void 0) request2.keyfile = keyfile;
                if (certfile !== void 0) request2.certfile = certfile;
                if (fallback !== void 0) request2.fallback = fallback;
                if (cors) {
                  const corsKeys = {};
                  const origin = getFlag(cors, corsKeys, "origin", mustBeStringOrArrayOfStrings);
                  checkForInvalidFlags(cors, corsKeys, `on "cors" object`);
                  if (Array.isArray(origin)) request2.corsOrigin = origin;
                  else if (origin !== void 0) request2.corsOrigin = [origin];
                }
                sendRequest(refs, request2, (error2, response2) => {
                  if (error2) return reject(new Error(error2));
                  if (onRequest) {
                    requestCallbacks["serve-request"] = (id, request3) => {
                      onRequest(request3.args);
                      sendResponse(id, {});
                    };
                  }
                  resolve(response2);
                });
              }), "serve"),
              cancel: /* @__PURE__ */ __name(() => new Promise((resolve) => {
                if (didDispose) return resolve();
                const request2 = {
                  command: "cancel",
                  key: buildKey
                };
                sendRequest(refs, request2, () => {
                  resolve();
                });
              }), "cancel"),
              dispose: /* @__PURE__ */ __name(() => new Promise((resolve) => {
                if (didDispose) return resolve();
                didDispose = true;
                const request2 = {
                  command: "dispose",
                  key: buildKey
                };
                sendRequest(refs, request2, () => {
                  resolve();
                  scheduleOnDisposeCallbacks();
                  refs.unref();
                });
              }), "dispose")
            };
            refs.ref();
            callback(null, result);
          });
        }
        __name(buildOrContextContinue, "buildOrContextContinue");
      }
      __name(buildOrContextImpl, "buildOrContextImpl");
      var handlePlugins = /* @__PURE__ */ __name((buildKey, sendRequest, sendResponse, refs, streamIn, requestCallbacks, initialOptions, plugins, details) => __async(null, null, function* () {
        let onStartCallbacks = [];
        let onEndCallbacks = [];
        let onResolveCallbacks = {};
        let onLoadCallbacks = {};
        let onDisposeCallbacks = [];
        let nextCallbackID = 0;
        let i = 0;
        let requestPlugins = [];
        let isSetupDone = false;
        plugins = [...plugins];
        for (let item of plugins) {
          let keys = {};
          if (typeof item !== "object") throw new Error(`Plugin at index ${i} must be an object`);
          const name = getFlag(item, keys, "name", mustBeString);
          if (typeof name !== "string" || name === "") throw new Error(`Plugin at index ${i} is missing a name`);
          try {
            let setup = getFlag(item, keys, "setup", mustBeFunction);
            if (typeof setup !== "function") throw new Error(`Plugin is missing a setup function`);
            checkForInvalidFlags(item, keys, `on plugin ${quote(name)}`);
            let plugin = {
              name,
              onStart: false,
              onEnd: false,
              onResolve: [],
              onLoad: []
            };
            i++;
            let resolve = /* @__PURE__ */ __name((path, options = {}) => {
              if (!isSetupDone) throw new Error('Cannot call "resolve" before plugin setup has completed');
              if (typeof path !== "string") throw new Error(`The path to resolve must be a string`);
              let keys2 = /* @__PURE__ */ Object.create(null);
              let pluginName = getFlag(options, keys2, "pluginName", mustBeString);
              let importer = getFlag(options, keys2, "importer", mustBeString);
              let namespace = getFlag(options, keys2, "namespace", mustBeString);
              let resolveDir = getFlag(options, keys2, "resolveDir", mustBeString);
              let kind = getFlag(options, keys2, "kind", mustBeString);
              let pluginData = getFlag(options, keys2, "pluginData", canBeAnything);
              let importAttributes = getFlag(options, keys2, "with", mustBeObject);
              checkForInvalidFlags(options, keys2, "in resolve() call");
              return new Promise((resolve2, reject) => {
                const request = {
                  command: "resolve",
                  path,
                  key: buildKey,
                  pluginName: name
                };
                if (pluginName != null) request.pluginName = pluginName;
                if (importer != null) request.importer = importer;
                if (namespace != null) request.namespace = namespace;
                if (resolveDir != null) request.resolveDir = resolveDir;
                if (kind != null) request.kind = kind;
                else throw new Error(`Must specify "kind" when calling "resolve"`);
                if (pluginData != null) request.pluginData = details.store(pluginData);
                if (importAttributes != null) request.with = sanitizeStringMap(importAttributes, "with");
                sendRequest(refs, request, (error, response) => {
                  if (error !== null) reject(new Error(error));
                  else resolve2({
                    errors: replaceDetailsInMessages(response.errors, details),
                    warnings: replaceDetailsInMessages(response.warnings, details),
                    path: response.path,
                    external: response.external,
                    sideEffects: response.sideEffects,
                    namespace: response.namespace,
                    suffix: response.suffix,
                    pluginData: details.load(response.pluginData)
                  });
                });
              });
            }, "resolve");
            let promise = setup({
              initialOptions,
              resolve,
              onStart(callback) {
                let registeredText = `This error came from the "onStart" callback registered here:`;
                let registeredNote = extractCallerV8(new Error(registeredText), streamIn, "onStart");
                onStartCallbacks.push({ name, callback, note: registeredNote });
                plugin.onStart = true;
              },
              onEnd(callback) {
                let registeredText = `This error came from the "onEnd" callback registered here:`;
                let registeredNote = extractCallerV8(new Error(registeredText), streamIn, "onEnd");
                onEndCallbacks.push({ name, callback, note: registeredNote });
                plugin.onEnd = true;
              },
              onResolve(options, callback) {
                let registeredText = `This error came from the "onResolve" callback registered here:`;
                let registeredNote = extractCallerV8(new Error(registeredText), streamIn, "onResolve");
                let keys2 = {};
                let filter = getFlag(options, keys2, "filter", mustBeRegExp);
                let namespace = getFlag(options, keys2, "namespace", mustBeString);
                checkForInvalidFlags(options, keys2, `in onResolve() call for plugin ${quote(name)}`);
                if (filter == null) throw new Error(`onResolve() call is missing a filter`);
                let id = nextCallbackID++;
                onResolveCallbacks[id] = { name, callback, note: registeredNote };
                plugin.onResolve.push({ id, filter: jsRegExpToGoRegExp(filter), namespace: namespace || "" });
              },
              onLoad(options, callback) {
                let registeredText = `This error came from the "onLoad" callback registered here:`;
                let registeredNote = extractCallerV8(new Error(registeredText), streamIn, "onLoad");
                let keys2 = {};
                let filter = getFlag(options, keys2, "filter", mustBeRegExp);
                let namespace = getFlag(options, keys2, "namespace", mustBeString);
                checkForInvalidFlags(options, keys2, `in onLoad() call for plugin ${quote(name)}`);
                if (filter == null) throw new Error(`onLoad() call is missing a filter`);
                let id = nextCallbackID++;
                onLoadCallbacks[id] = { name, callback, note: registeredNote };
                plugin.onLoad.push({ id, filter: jsRegExpToGoRegExp(filter), namespace: namespace || "" });
              },
              onDispose(callback) {
                onDisposeCallbacks.push(callback);
              },
              esbuild: streamIn.esbuild
            });
            if (promise) yield promise;
            requestPlugins.push(plugin);
          } catch (e) {
            return { ok: false, error: e, pluginName: name };
          }
        }
        requestCallbacks["on-start"] = (id, request) => __async(null, null, function* () {
          details.clear();
          let response = { errors: [], warnings: [] };
          yield Promise.all(onStartCallbacks.map((_0) => __async(null, [_0], function* ({ name, callback, note }) {
            try {
              let result = yield callback();
              if (result != null) {
                if (typeof result !== "object") throw new Error(`Expected onStart() callback in plugin ${quote(name)} to return an object`);
                let keys = {};
                let errors = getFlag(result, keys, "errors", mustBeArray);
                let warnings = getFlag(result, keys, "warnings", mustBeArray);
                checkForInvalidFlags(result, keys, `from onStart() callback in plugin ${quote(name)}`);
                if (errors != null) response.errors.push(...sanitizeMessages(errors, "errors", details, name, void 0));
                if (warnings != null) response.warnings.push(...sanitizeMessages(warnings, "warnings", details, name, void 0));
              }
            } catch (e) {
              response.errors.push(extractErrorMessageV8(e, streamIn, details, note && note(), name));
            }
          })));
          sendResponse(id, response);
        });
        requestCallbacks["on-resolve"] = (id, request) => __async(null, null, function* () {
          let response = {}, name = "", callback, note;
          for (let id2 of request.ids) {
            try {
              ({ name, callback, note } = onResolveCallbacks[id2]);
              let result = yield callback({
                path: request.path,
                importer: request.importer,
                namespace: request.namespace,
                resolveDir: request.resolveDir,
                kind: request.kind,
                pluginData: details.load(request.pluginData),
                with: request.with
              });
              if (result != null) {
                if (typeof result !== "object") throw new Error(`Expected onResolve() callback in plugin ${quote(name)} to return an object`);
                let keys = {};
                let pluginName = getFlag(result, keys, "pluginName", mustBeString);
                let path = getFlag(result, keys, "path", mustBeString);
                let namespace = getFlag(result, keys, "namespace", mustBeString);
                let suffix = getFlag(result, keys, "suffix", mustBeString);
                let external = getFlag(result, keys, "external", mustBeBoolean);
                let sideEffects = getFlag(result, keys, "sideEffects", mustBeBoolean);
                let pluginData = getFlag(result, keys, "pluginData", canBeAnything);
                let errors = getFlag(result, keys, "errors", mustBeArray);
                let warnings = getFlag(result, keys, "warnings", mustBeArray);
                let watchFiles = getFlag(result, keys, "watchFiles", mustBeArrayOfStrings);
                let watchDirs = getFlag(result, keys, "watchDirs", mustBeArrayOfStrings);
                checkForInvalidFlags(result, keys, `from onResolve() callback in plugin ${quote(name)}`);
                response.id = id2;
                if (pluginName != null) response.pluginName = pluginName;
                if (path != null) response.path = path;
                if (namespace != null) response.namespace = namespace;
                if (suffix != null) response.suffix = suffix;
                if (external != null) response.external = external;
                if (sideEffects != null) response.sideEffects = sideEffects;
                if (pluginData != null) response.pluginData = details.store(pluginData);
                if (errors != null) response.errors = sanitizeMessages(errors, "errors", details, name, void 0);
                if (warnings != null) response.warnings = sanitizeMessages(warnings, "warnings", details, name, void 0);
                if (watchFiles != null) response.watchFiles = sanitizeStringArray(watchFiles, "watchFiles");
                if (watchDirs != null) response.watchDirs = sanitizeStringArray(watchDirs, "watchDirs");
                break;
              }
            } catch (e) {
              response = { id: id2, errors: [extractErrorMessageV8(e, streamIn, details, note && note(), name)] };
              break;
            }
          }
          sendResponse(id, response);
        });
        requestCallbacks["on-load"] = (id, request) => __async(null, null, function* () {
          let response = {}, name = "", callback, note;
          for (let id2 of request.ids) {
            try {
              ({ name, callback, note } = onLoadCallbacks[id2]);
              let result = yield callback({
                path: request.path,
                namespace: request.namespace,
                suffix: request.suffix,
                pluginData: details.load(request.pluginData),
                with: request.with
              });
              if (result != null) {
                if (typeof result !== "object") throw new Error(`Expected onLoad() callback in plugin ${quote(name)} to return an object`);
                let keys = {};
                let pluginName = getFlag(result, keys, "pluginName", mustBeString);
                let contents = getFlag(result, keys, "contents", mustBeStringOrUint8Array);
                let resolveDir = getFlag(result, keys, "resolveDir", mustBeString);
                let pluginData = getFlag(result, keys, "pluginData", canBeAnything);
                let loader = getFlag(result, keys, "loader", mustBeString);
                let errors = getFlag(result, keys, "errors", mustBeArray);
                let warnings = getFlag(result, keys, "warnings", mustBeArray);
                let watchFiles = getFlag(result, keys, "watchFiles", mustBeArrayOfStrings);
                let watchDirs = getFlag(result, keys, "watchDirs", mustBeArrayOfStrings);
                checkForInvalidFlags(result, keys, `from onLoad() callback in plugin ${quote(name)}`);
                response.id = id2;
                if (pluginName != null) response.pluginName = pluginName;
                if (contents instanceof Uint8Array) response.contents = contents;
                else if (contents != null) response.contents = encodeUTF8(contents);
                if (resolveDir != null) response.resolveDir = resolveDir;
                if (pluginData != null) response.pluginData = details.store(pluginData);
                if (loader != null) response.loader = loader;
                if (errors != null) response.errors = sanitizeMessages(errors, "errors", details, name, void 0);
                if (warnings != null) response.warnings = sanitizeMessages(warnings, "warnings", details, name, void 0);
                if (watchFiles != null) response.watchFiles = sanitizeStringArray(watchFiles, "watchFiles");
                if (watchDirs != null) response.watchDirs = sanitizeStringArray(watchDirs, "watchDirs");
                break;
              }
            } catch (e) {
              response = { id: id2, errors: [extractErrorMessageV8(e, streamIn, details, note && note(), name)] };
              break;
            }
          }
          sendResponse(id, response);
        });
        let runOnEndCallbacks = /* @__PURE__ */ __name((result, done) => done([], []), "runOnEndCallbacks");
        if (onEndCallbacks.length > 0) {
          runOnEndCallbacks = /* @__PURE__ */ __name((result, done) => {
            (() => __async(null, null, function* () {
              const onEndErrors = [];
              const onEndWarnings = [];
              for (const { name, callback, note } of onEndCallbacks) {
                let newErrors;
                let newWarnings;
                try {
                  const value = yield callback(result);
                  if (value != null) {
                    if (typeof value !== "object") throw new Error(`Expected onEnd() callback in plugin ${quote(name)} to return an object`);
                    let keys = {};
                    let errors = getFlag(value, keys, "errors", mustBeArray);
                    let warnings = getFlag(value, keys, "warnings", mustBeArray);
                    checkForInvalidFlags(value, keys, `from onEnd() callback in plugin ${quote(name)}`);
                    if (errors != null) newErrors = sanitizeMessages(errors, "errors", details, name, void 0);
                    if (warnings != null) newWarnings = sanitizeMessages(warnings, "warnings", details, name, void 0);
                  }
                } catch (e) {
                  newErrors = [extractErrorMessageV8(e, streamIn, details, note && note(), name)];
                }
                if (newErrors) {
                  onEndErrors.push(...newErrors);
                  try {
                    result.errors.push(...newErrors);
                  } catch (e) {
                  }
                }
                if (newWarnings) {
                  onEndWarnings.push(...newWarnings);
                  try {
                    result.warnings.push(...newWarnings);
                  } catch (e) {
                  }
                }
              }
              done(onEndErrors, onEndWarnings);
            }))();
          }, "runOnEndCallbacks");
        }
        let scheduleOnDisposeCallbacks = /* @__PURE__ */ __name(() => {
          for (const cb of onDisposeCallbacks) {
            setTimeout(() => cb(), 0);
          }
        }, "scheduleOnDisposeCallbacks");
        isSetupDone = true;
        return {
          ok: true,
          requestPlugins,
          runOnEndCallbacks,
          scheduleOnDisposeCallbacks
        };
      }), "handlePlugins");
      function createObjectStash() {
        const map = /* @__PURE__ */ new Map();
        let nextID = 0;
        return {
          clear() {
            map.clear();
          },
          load(id) {
            return map.get(id);
          },
          store(value) {
            if (value === void 0) return -1;
            const id = nextID++;
            map.set(id, value);
            return id;
          }
        };
      }
      __name(createObjectStash, "createObjectStash");
      function extractCallerV8(e, streamIn, ident) {
        let note;
        let tried = false;
        return () => {
          if (tried) return note;
          tried = true;
          try {
            let lines = (e.stack + "").split("\n");
            lines.splice(1, 1);
            let location2 = parseStackLinesV8(streamIn, lines, ident);
            if (location2) {
              note = { text: e.message, location: location2 };
              return note;
            }
          } catch (e2) {
          }
        };
      }
      __name(extractCallerV8, "extractCallerV8");
      function extractErrorMessageV8(e, streamIn, stash, note, pluginName) {
        let text = "Internal error";
        let location2 = null;
        try {
          text = (e && e.message || e) + "";
        } catch (e2) {
        }
        try {
          location2 = parseStackLinesV8(streamIn, (e.stack + "").split("\n"), "");
        } catch (e2) {
        }
        return { id: "", pluginName, text, location: location2, notes: note ? [note] : [], detail: stash ? stash.store(e) : -1 };
      }
      __name(extractErrorMessageV8, "extractErrorMessageV8");
      function parseStackLinesV8(streamIn, lines, ident) {
        let at = "    at ";
        if (streamIn.readFileSync && !lines[0].startsWith(at) && lines[1].startsWith(at)) {
          for (let i = 1; i < lines.length; i++) {
            let line = lines[i];
            if (!line.startsWith(at)) continue;
            line = line.slice(at.length);
            while (true) {
              let match = /^(?:new |async )?\S+ \((.*)\)$/.exec(line);
              if (match) {
                line = match[1];
                continue;
              }
              match = /^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(line);
              if (match) {
                line = match[1];
                continue;
              }
              match = /^(\S+):(\d+):(\d+)$/.exec(line);
              if (match) {
                let contents;
                try {
                  contents = streamIn.readFileSync(match[1], "utf8");
                } catch (e) {
                  break;
                }
                let lineText = contents.split(/\r\n|\r|\n|\u2028|\u2029/)[+match[2] - 1] || "";
                let column = +match[3] - 1;
                let length = lineText.slice(column, column + ident.length) === ident ? ident.length : 0;
                return {
                  file: match[1],
                  namespace: "file",
                  line: +match[2],
                  column: encodeUTF8(lineText.slice(0, column)).length,
                  length: encodeUTF8(lineText.slice(column, column + length)).length,
                  lineText: lineText + "\n" + lines.slice(1).join("\n"),
                  suggestion: ""
                };
              }
              break;
            }
          }
        }
        return null;
      }
      __name(parseStackLinesV8, "parseStackLinesV8");
      function failureErrorWithLog(text, errors, warnings) {
        let limit = 5;
        text += errors.length < 1 ? "" : ` with ${errors.length} error${errors.length < 2 ? "" : "s"}:` + errors.slice(0, limit + 1).map((e, i) => {
          if (i === limit) return "\n...";
          if (!e.location) return `
error: ${e.text}`;
          let { file, line, column } = e.location;
          let pluginText = e.pluginName ? `[plugin: ${e.pluginName}] ` : "";
          return `
${file}:${line}:${column}: ERROR: ${pluginText}${e.text}`;
        }).join("");
        let error = new Error(text);
        for (const [key, value] of [["errors", errors], ["warnings", warnings]]) {
          Object.defineProperty(error, key, {
            configurable: true,
            enumerable: true,
            get: /* @__PURE__ */ __name(() => value, "get"),
            set: /* @__PURE__ */ __name((value2) => Object.defineProperty(error, key, {
              configurable: true,
              enumerable: true,
              value: value2
            }), "set")
          });
        }
        return error;
      }
      __name(failureErrorWithLog, "failureErrorWithLog");
      function replaceDetailsInMessages(messages, stash) {
        for (const message of messages) {
          message.detail = stash.load(message.detail);
        }
        return messages;
      }
      __name(replaceDetailsInMessages, "replaceDetailsInMessages");
      function sanitizeLocation(location2, where, terminalWidth) {
        if (location2 == null) return null;
        let keys = {};
        let file = getFlag(location2, keys, "file", mustBeString);
        let namespace = getFlag(location2, keys, "namespace", mustBeString);
        let line = getFlag(location2, keys, "line", mustBeInteger);
        let column = getFlag(location2, keys, "column", mustBeInteger);
        let length = getFlag(location2, keys, "length", mustBeInteger);
        let lineText = getFlag(location2, keys, "lineText", mustBeString);
        let suggestion = getFlag(location2, keys, "suggestion", mustBeString);
        checkForInvalidFlags(location2, keys, where);
        if (lineText) {
          const relevantASCII = lineText.slice(
            0,
            (column && column > 0 ? column : 0) + (length && length > 0 ? length : 0) + (terminalWidth && terminalWidth > 0 ? terminalWidth : 80)
          );
          if (!/[\x7F-\uFFFF]/.test(relevantASCII) && !/\n/.test(lineText)) {
            lineText = relevantASCII;
          }
        }
        return {
          file: file || "",
          namespace: namespace || "",
          line: line || 0,
          column: column || 0,
          length: length || 0,
          lineText: lineText || "",
          suggestion: suggestion || ""
        };
      }
      __name(sanitizeLocation, "sanitizeLocation");
      function sanitizeMessages(messages, property, stash, fallbackPluginName, terminalWidth) {
        let messagesClone = [];
        let index = 0;
        for (const message of messages) {
          let keys = {};
          let id = getFlag(message, keys, "id", mustBeString);
          let pluginName = getFlag(message, keys, "pluginName", mustBeString);
          let text = getFlag(message, keys, "text", mustBeString);
          let location2 = getFlag(message, keys, "location", mustBeObjectOrNull);
          let notes = getFlag(message, keys, "notes", mustBeArray);
          let detail = getFlag(message, keys, "detail", canBeAnything);
          let where = `in element ${index} of "${property}"`;
          checkForInvalidFlags(message, keys, where);
          let notesClone = [];
          if (notes) {
            for (const note of notes) {
              let noteKeys = {};
              let noteText = getFlag(note, noteKeys, "text", mustBeString);
              let noteLocation = getFlag(note, noteKeys, "location", mustBeObjectOrNull);
              checkForInvalidFlags(note, noteKeys, where);
              notesClone.push({
                text: noteText || "",
                location: sanitizeLocation(noteLocation, where, terminalWidth)
              });
            }
          }
          messagesClone.push({
            id: id || "",
            pluginName: pluginName || fallbackPluginName,
            text: text || "",
            location: sanitizeLocation(location2, where, terminalWidth),
            notes: notesClone,
            detail: stash ? stash.store(detail) : -1
          });
          index++;
        }
        return messagesClone;
      }
      __name(sanitizeMessages, "sanitizeMessages");
      function sanitizeStringArray(values, property) {
        const result = [];
        for (const value of values) {
          if (typeof value !== "string") throw new Error(`${quote(property)} must be an array of strings`);
          result.push(value);
        }
        return result;
      }
      __name(sanitizeStringArray, "sanitizeStringArray");
      function sanitizeStringMap(map, property) {
        const result = /* @__PURE__ */ Object.create(null);
        for (const key in map) {
          const value = map[key];
          if (typeof value !== "string") throw new Error(`key ${quote(key)} in object ${quote(property)} must be a string`);
          result[key] = value;
        }
        return result;
      }
      __name(sanitizeStringMap, "sanitizeStringMap");
      function convertOutputFiles({ path, contents, hash }) {
        let text = null;
        return {
          path,
          contents,
          hash,
          get text() {
            const binary = this.contents;
            if (text === null || binary !== contents) {
              contents = binary;
              text = decodeUTF8(binary);
            }
            return text;
          }
        };
      }
      __name(convertOutputFiles, "convertOutputFiles");
      function jsRegExpToGoRegExp(regexp) {
        let result = regexp.source;
        if (regexp.flags) result = `(?${regexp.flags})${result}`;
        return result;
      }
      __name(jsRegExpToGoRegExp, "jsRegExpToGoRegExp");
      var version = "0.27.0";
      var build = /* @__PURE__ */ __name((options) => ensureServiceIsRunning().build(options), "build");
      var context = /* @__PURE__ */ __name((options) => ensureServiceIsRunning().context(options), "context");
      var transform = /* @__PURE__ */ __name((input, options) => ensureServiceIsRunning().transform(input, options), "transform");
      var formatMessages = /* @__PURE__ */ __name((messages, options) => ensureServiceIsRunning().formatMessages(messages, options), "formatMessages");
      var analyzeMetafile = /* @__PURE__ */ __name((metafile, options) => ensureServiceIsRunning().analyzeMetafile(metafile, options), "analyzeMetafile");
      var buildSync = /* @__PURE__ */ __name(() => {
        throw new Error(`The "buildSync" API only works in node`);
      }, "buildSync");
      var transformSync = /* @__PURE__ */ __name(() => {
        throw new Error(`The "transformSync" API only works in node`);
      }, "transformSync");
      var formatMessagesSync = /* @__PURE__ */ __name(() => {
        throw new Error(`The "formatMessagesSync" API only works in node`);
      }, "formatMessagesSync");
      var analyzeMetafileSync = /* @__PURE__ */ __name(() => {
        throw new Error(`The "analyzeMetafileSync" API only works in node`);
      }, "analyzeMetafileSync");
      var stop = /* @__PURE__ */ __name(() => {
        if (stopService) stopService();
        return Promise.resolve();
      }, "stop");
      var initializePromise;
      var stopService;
      var longLivedService;
      var ensureServiceIsRunning = /* @__PURE__ */ __name(() => {
        if (longLivedService) return longLivedService;
        if (initializePromise) throw new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this');
        throw new Error('You need to call "initialize" before calling this');
      }, "ensureServiceIsRunning");
      var initialize = /* @__PURE__ */ __name((options) => {
        options = validateInitializeOptions(options || {});
        let wasmURL = options.wasmURL;
        let wasmModule = options.wasmModule;
        let useWorker = options.worker !== false;
        if (!wasmURL && !wasmModule) throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');
        if (initializePromise) throw new Error('Cannot call "initialize" more than once');
        initializePromise = startRunningService(wasmURL || "", wasmModule, useWorker);
        initializePromise.catch(() => {
          initializePromise = void 0;
        });
        return initializePromise;
      }, "initialize");
      var startRunningService = /* @__PURE__ */ __name((wasmURL, wasmModule, useWorker) => __async(null, null, function* () {
        let worker;
        let rejectAllWith;
        const rejectAllPromise = new Promise((resolve) => rejectAllWith = resolve);
        if (useWorker) {
          let blob = new Blob([`onmessage=${'((postMessage) => {\n      // Copyright 2018 The Go Authors. All rights reserved.\n      // Use of this source code is governed by a BSD-style\n      // license that can be found in the LICENSE file.\n      var __async = (__this, __arguments, generator) => {\n        return new Promise((resolve, reject) => {\n          var fulfilled = (value) => {\n            try {\n              step(generator.next(value));\n            } catch (e) {\n              reject(e);\n            }\n          };\n          var rejected = (value) => {\n            try {\n              step(generator.throw(value));\n            } catch (e) {\n              reject(e);\n            }\n          };\n          var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);\n          step((generator = generator.apply(__this, __arguments)).next());\n        });\n      };\n      let onmessage;\n      let globalThis = {};\n      for (let o = self; o; o = Object.getPrototypeOf(o))\n        for (let k of Object.getOwnPropertyNames(o))\n          if (!(k in globalThis))\n            Object.defineProperty(globalThis, k, { get: () => self[k] });\n      "use strict";\n      (() => {\n        const enosys = () => {\n          const err = new Error("not implemented");\n          err.code = "ENOSYS";\n          return err;\n        };\n        if (!globalThis.fs) {\n          let outputBuf = "";\n          globalThis.fs = {\n            constants: { O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1, O_DIRECTORY: -1 },\n            // unused\n            writeSync(fd, buf) {\n              outputBuf += decoder.decode(buf);\n              const nl = outputBuf.lastIndexOf("\\n");\n              if (nl != -1) {\n                console.log(outputBuf.substring(0, nl));\n                outputBuf = outputBuf.substring(nl + 1);\n              }\n              return buf.length;\n            },\n            write(fd, buf, offset, length, position, callback) {\n              if (offset !== 0 || length !== buf.length || position !== null) {\n                callback(enosys());\n                return;\n              }\n              const n = this.writeSync(fd, buf);\n              callback(null, n);\n            },\n            chmod(path, mode, callback) {\n              callback(enosys());\n            },\n            chown(path, uid, gid, callback) {\n              callback(enosys());\n            },\n            close(fd, callback) {\n              callback(enosys());\n            },\n            fchmod(fd, mode, callback) {\n              callback(enosys());\n            },\n            fchown(fd, uid, gid, callback) {\n              callback(enosys());\n            },\n            fstat(fd, callback) {\n              callback(enosys());\n            },\n            fsync(fd, callback) {\n              callback(null);\n            },\n            ftruncate(fd, length, callback) {\n              callback(enosys());\n            },\n            lchown(path, uid, gid, callback) {\n              callback(enosys());\n            },\n            link(path, link, callback) {\n              callback(enosys());\n            },\n            lstat(path, callback) {\n              callback(enosys());\n            },\n            mkdir(path, perm, callback) {\n              callback(enosys());\n            },\n            open(path, flags, mode, callback) {\n              callback(enosys());\n            },\n            read(fd, buffer, offset, length, position, callback) {\n              callback(enosys());\n            },\n            readdir(path, callback) {\n              callback(enosys());\n            },\n            readlink(path, callback) {\n              callback(enosys());\n            },\n            rename(from, to, callback) {\n              callback(enosys());\n            },\n            rmdir(path, callback) {\n              callback(enosys());\n            },\n            stat(path, callback) {\n              callback(enosys());\n            },\n            symlink(path, link, callback) {\n              callback(enosys());\n            },\n            truncate(path, length, callback) {\n              callback(enosys());\n            },\n            unlink(path, callback) {\n              callback(enosys());\n            },\n            utimes(path, atime, mtime, callback) {\n              callback(enosys());\n            }\n          };\n        }\n        if (!globalThis.process) {\n          globalThis.process = {\n            getuid() {\n              return -1;\n            },\n            getgid() {\n              return -1;\n            },\n            geteuid() {\n              return -1;\n            },\n            getegid() {\n              return -1;\n            },\n            getgroups() {\n              throw enosys();\n            },\n            pid: -1,\n            ppid: -1,\n            umask() {\n              throw enosys();\n            },\n            cwd() {\n              throw enosys();\n            },\n            chdir() {\n              throw enosys();\n            }\n          };\n        }\n        if (!globalThis.path) {\n          globalThis.path = {\n            resolve(...pathSegments) {\n              return pathSegments.join("/");\n            }\n          };\n        }\n        if (!globalThis.crypto) {\n          throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");\n        }\n        if (!globalThis.performance) {\n          throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");\n        }\n        if (!globalThis.TextEncoder) {\n          throw new Error("globalThis.TextEncoder is not available, polyfill required");\n        }\n        if (!globalThis.TextDecoder) {\n          throw new Error("globalThis.TextDecoder is not available, polyfill required");\n        }\n        const encoder = new TextEncoder("utf-8");\n        const decoder = new TextDecoder("utf-8");\n        globalThis.Go = class {\n          constructor() {\n            this.argv = ["js"];\n            this.env = {};\n            this.exit = (code) => {\n              if (code !== 0) {\n                console.warn("exit code:", code);\n              }\n            };\n            this._exitPromise = new Promise((resolve) => {\n              this._resolveExitPromise = resolve;\n            });\n            this._pendingEvent = null;\n            this._scheduledTimeouts = /* @__PURE__ */ new Map();\n            this._nextCallbackTimeoutID = 1;\n            const setInt64 = (addr, v) => {\n              this.mem.setUint32(addr + 0, v, true);\n              this.mem.setUint32(addr + 4, Math.floor(v / 4294967296), true);\n            };\n            const setInt32 = (addr, v) => {\n              this.mem.setUint32(addr + 0, v, true);\n            };\n            const getInt64 = (addr) => {\n              const low = this.mem.getUint32(addr + 0, true);\n              const high = this.mem.getInt32(addr + 4, true);\n              return low + high * 4294967296;\n            };\n            const loadValue = (addr) => {\n              const f = this.mem.getFloat64(addr, true);\n              if (f === 0) {\n                return void 0;\n              }\n              if (!isNaN(f)) {\n                return f;\n              }\n              const id = this.mem.getUint32(addr, true);\n              return this._values[id];\n            };\n            const storeValue = (addr, v) => {\n              const nanHead = 2146959360;\n              if (typeof v === "number" && v !== 0) {\n                if (isNaN(v)) {\n                  this.mem.setUint32(addr + 4, nanHead, true);\n                  this.mem.setUint32(addr, 0, true);\n                  return;\n                }\n                this.mem.setFloat64(addr, v, true);\n                return;\n              }\n              if (v === void 0) {\n                this.mem.setFloat64(addr, 0, true);\n                return;\n              }\n              let id = this._ids.get(v);\n              if (id === void 0) {\n                id = this._idPool.pop();\n                if (id === void 0) {\n                  id = this._values.length;\n                }\n                this._values[id] = v;\n                this._goRefCounts[id] = 0;\n                this._ids.set(v, id);\n              }\n              this._goRefCounts[id]++;\n              let typeFlag = 0;\n              switch (typeof v) {\n                case "object":\n                  if (v !== null) {\n                    typeFlag = 1;\n                  }\n                  break;\n                case "string":\n                  typeFlag = 2;\n                  break;\n                case "symbol":\n                  typeFlag = 3;\n                  break;\n                case "function":\n                  typeFlag = 4;\n                  break;\n              }\n              this.mem.setUint32(addr + 4, nanHead | typeFlag, true);\n              this.mem.setUint32(addr, id, true);\n            };\n            const loadSlice = (addr) => {\n              const array = getInt64(addr + 0);\n              const len = getInt64(addr + 8);\n              return new Uint8Array(this._inst.exports.mem.buffer, array, len);\n            };\n            const loadSliceOfValues = (addr) => {\n              const array = getInt64(addr + 0);\n              const len = getInt64(addr + 8);\n              const a = new Array(len);\n              for (let i = 0; i < len; i++) {\n                a[i] = loadValue(array + i * 8);\n              }\n              return a;\n            };\n            const loadString = (addr) => {\n              const saddr = getInt64(addr + 0);\n              const len = getInt64(addr + 8);\n              return decoder.decode(new DataView(this._inst.exports.mem.buffer, saddr, len));\n            };\n            const testCallExport = (a, b) => {\n              this._inst.exports.testExport0();\n              return this._inst.exports.testExport(a, b);\n            };\n            const timeOrigin = Date.now() - performance.now();\n            this.importObject = {\n              _gotest: {\n                add: (a, b) => a + b,\n                callExport: testCallExport\n              },\n              gojs: {\n                // Go\'s SP does not change as long as no Go code is running. Some operations (e.g. calls, getters and setters)\n                // may synchronously trigger a Go event handler. This makes Go code get executed in the middle of the imported\n                // function. A goroutine can switch to a new stack if the current stack is too small (see morestack function).\n                // This changes the SP, thus we have to update the SP used by the imported function.\n                // func wasmExit(code int32)\n                "runtime.wasmExit": (sp) => {\n                  sp >>>= 0;\n                  const code = this.mem.getInt32(sp + 8, true);\n                  this.exited = true;\n                  delete this._inst;\n                  delete this._values;\n                  delete this._goRefCounts;\n                  delete this._ids;\n                  delete this._idPool;\n                  this.exit(code);\n                },\n                // func wasmWrite(fd uintptr, p unsafe.Pointer, n int32)\n                "runtime.wasmWrite": (sp) => {\n                  sp >>>= 0;\n                  const fd = getInt64(sp + 8);\n                  const p = getInt64(sp + 16);\n                  const n = this.mem.getInt32(sp + 24, true);\n                  globalThis.fs.writeSync(fd, new Uint8Array(this._inst.exports.mem.buffer, p, n));\n                },\n                // func resetMemoryDataView()\n                "runtime.resetMemoryDataView": (sp) => {\n                  sp >>>= 0;\n                  this.mem = new DataView(this._inst.exports.mem.buffer);\n                },\n                // func nanotime1() int64\n                "runtime.nanotime1": (sp) => {\n                  sp >>>= 0;\n                  setInt64(sp + 8, (timeOrigin + performance.now()) * 1e6);\n                },\n                // func walltime() (sec int64, nsec int32)\n                "runtime.walltime": (sp) => {\n                  sp >>>= 0;\n                  const msec = (/* @__PURE__ */ new Date()).getTime();\n                  setInt64(sp + 8, msec / 1e3);\n                  this.mem.setInt32(sp + 16, msec % 1e3 * 1e6, true);\n                },\n                // func scheduleTimeoutEvent(delay int64) int32\n                "runtime.scheduleTimeoutEvent": (sp) => {\n                  sp >>>= 0;\n                  const id = this._nextCallbackTimeoutID;\n                  this._nextCallbackTimeoutID++;\n                  this._scheduledTimeouts.set(id, setTimeout(\n                    () => {\n                      this._resume();\n                      while (this._scheduledTimeouts.has(id)) {\n                        console.warn("scheduleTimeoutEvent: missed timeout event");\n                        this._resume();\n                      }\n                    },\n                    getInt64(sp + 8)\n                  ));\n                  this.mem.setInt32(sp + 16, id, true);\n                },\n                // func clearTimeoutEvent(id int32)\n                "runtime.clearTimeoutEvent": (sp) => {\n                  sp >>>= 0;\n                  const id = this.mem.getInt32(sp + 8, true);\n                  clearTimeout(this._scheduledTimeouts.get(id));\n                  this._scheduledTimeouts.delete(id);\n                },\n                // func getRandomData(r []byte)\n                "runtime.getRandomData": (sp) => {\n                  sp >>>= 0;\n                  crypto.getRandomValues(loadSlice(sp + 8));\n                },\n                // func finalizeRef(v ref)\n                "syscall/js.finalizeRef": (sp) => {\n                  sp >>>= 0;\n                  const id = this.mem.getUint32(sp + 8, true);\n                  this._goRefCounts[id]--;\n                  if (this._goRefCounts[id] === 0) {\n                    const v = this._values[id];\n                    this._values[id] = null;\n                    this._ids.delete(v);\n                    this._idPool.push(id);\n                  }\n                },\n                // func stringVal(value string) ref\n                "syscall/js.stringVal": (sp) => {\n                  sp >>>= 0;\n                  storeValue(sp + 24, loadString(sp + 8));\n                },\n                // func valueGet(v ref, p string) ref\n                "syscall/js.valueGet": (sp) => {\n                  sp >>>= 0;\n                  const result = Reflect.get(loadValue(sp + 8), loadString(sp + 16));\n                  sp = this._inst.exports.getsp() >>> 0;\n                  storeValue(sp + 32, result);\n                },\n                // func valueSet(v ref, p string, x ref)\n                "syscall/js.valueSet": (sp) => {\n                  sp >>>= 0;\n                  Reflect.set(loadValue(sp + 8), loadString(sp + 16), loadValue(sp + 32));\n                },\n                // func valueDelete(v ref, p string)\n                "syscall/js.valueDelete": (sp) => {\n                  sp >>>= 0;\n                  Reflect.deleteProperty(loadValue(sp + 8), loadString(sp + 16));\n                },\n                // func valueIndex(v ref, i int) ref\n                "syscall/js.valueIndex": (sp) => {\n                  sp >>>= 0;\n                  storeValue(sp + 24, Reflect.get(loadValue(sp + 8), getInt64(sp + 16)));\n                },\n                // valueSetIndex(v ref, i int, x ref)\n                "syscall/js.valueSetIndex": (sp) => {\n                  sp >>>= 0;\n                  Reflect.set(loadValue(sp + 8), getInt64(sp + 16), loadValue(sp + 24));\n                },\n                // func valueCall(v ref, m string, args []ref) (ref, bool)\n                "syscall/js.valueCall": (sp) => {\n                  sp >>>= 0;\n                  try {\n                    const v = loadValue(sp + 8);\n                    const m = Reflect.get(v, loadString(sp + 16));\n                    const args = loadSliceOfValues(sp + 32);\n                    const result = Reflect.apply(m, v, args);\n                    sp = this._inst.exports.getsp() >>> 0;\n                    storeValue(sp + 56, result);\n                    this.mem.setUint8(sp + 64, 1);\n                  } catch (err) {\n                    sp = this._inst.exports.getsp() >>> 0;\n                    storeValue(sp + 56, err);\n                    this.mem.setUint8(sp + 64, 0);\n                  }\n                },\n                // func valueInvoke(v ref, args []ref) (ref, bool)\n                "syscall/js.valueInvoke": (sp) => {\n                  sp >>>= 0;\n                  try {\n                    const v = loadValue(sp + 8);\n                    const args = loadSliceOfValues(sp + 16);\n                    const result = Reflect.apply(v, void 0, args);\n                    sp = this._inst.exports.getsp() >>> 0;\n                    storeValue(sp + 40, result);\n                    this.mem.setUint8(sp + 48, 1);\n                  } catch (err) {\n                    sp = this._inst.exports.getsp() >>> 0;\n                    storeValue(sp + 40, err);\n                    this.mem.setUint8(sp + 48, 0);\n                  }\n                },\n                // func valueNew(v ref, args []ref) (ref, bool)\n                "syscall/js.valueNew": (sp) => {\n                  sp >>>= 0;\n                  try {\n                    const v = loadValue(sp + 8);\n                    const args = loadSliceOfValues(sp + 16);\n                    const result = Reflect.construct(v, args);\n                    sp = this._inst.exports.getsp() >>> 0;\n                    storeValue(sp + 40, result);\n                    this.mem.setUint8(sp + 48, 1);\n                  } catch (err) {\n                    sp = this._inst.exports.getsp() >>> 0;\n                    storeValue(sp + 40, err);\n                    this.mem.setUint8(sp + 48, 0);\n                  }\n                },\n                // func valueLength(v ref) int\n                "syscall/js.valueLength": (sp) => {\n                  sp >>>= 0;\n                  setInt64(sp + 16, parseInt(loadValue(sp + 8).length));\n                },\n                // valuePrepareString(v ref) (ref, int)\n                "syscall/js.valuePrepareString": (sp) => {\n                  sp >>>= 0;\n                  const str = encoder.encode(String(loadValue(sp + 8)));\n                  storeValue(sp + 16, str);\n                  setInt64(sp + 24, str.length);\n                },\n                // valueLoadString(v ref, b []byte)\n                "syscall/js.valueLoadString": (sp) => {\n                  sp >>>= 0;\n                  const str = loadValue(sp + 8);\n                  loadSlice(sp + 16).set(str);\n                },\n                // func valueInstanceOf(v ref, t ref) bool\n                "syscall/js.valueInstanceOf": (sp) => {\n                  sp >>>= 0;\n                  this.mem.setUint8(sp + 24, loadValue(sp + 8) instanceof loadValue(sp + 16) ? 1 : 0);\n                },\n                // func copyBytesToGo(dst []byte, src ref) (int, bool)\n                "syscall/js.copyBytesToGo": (sp) => {\n                  sp >>>= 0;\n                  const dst = loadSlice(sp + 8);\n                  const src = loadValue(sp + 32);\n                  if (!(src instanceof Uint8Array || src instanceof Uint8ClampedArray)) {\n                    this.mem.setUint8(sp + 48, 0);\n                    return;\n                  }\n                  const toCopy = src.subarray(0, dst.length);\n                  dst.set(toCopy);\n                  setInt64(sp + 40, toCopy.length);\n                  this.mem.setUint8(sp + 48, 1);\n                },\n                // func copyBytesToJS(dst ref, src []byte) (int, bool)\n                "syscall/js.copyBytesToJS": (sp) => {\n                  sp >>>= 0;\n                  const dst = loadValue(sp + 8);\n                  const src = loadSlice(sp + 16);\n                  if (!(dst instanceof Uint8Array || dst instanceof Uint8ClampedArray)) {\n                    this.mem.setUint8(sp + 48, 0);\n                    return;\n                  }\n                  const toCopy = src.subarray(0, dst.length);\n                  dst.set(toCopy);\n                  setInt64(sp + 40, toCopy.length);\n                  this.mem.setUint8(sp + 48, 1);\n                },\n                "debug": (value) => {\n                  console.log(value);\n                }\n              }\n            };\n          }\n          run(instance) {\n            return __async(this, null, function* () {\n              if (!(instance instanceof WebAssembly.Instance)) {\n                throw new Error("Go.run: WebAssembly.Instance expected");\n              }\n              this._inst = instance;\n              this.mem = new DataView(this._inst.exports.mem.buffer);\n              this._values = [\n                // JS values that Go currently has references to, indexed by reference id\n                NaN,\n                0,\n                null,\n                true,\n                false,\n                globalThis,\n                this\n              ];\n              this._goRefCounts = new Array(this._values.length).fill(Infinity);\n              this._ids = /* @__PURE__ */ new Map([\n                // mapping from JS values to reference ids\n                [0, 1],\n                [null, 2],\n                [true, 3],\n                [false, 4],\n                [globalThis, 5],\n                [this, 6]\n              ]);\n              this._idPool = [];\n              this.exited = false;\n              let offset = 4096;\n              const strPtr = (str) => {\n                const ptr = offset;\n                const bytes = encoder.encode(str + "\\0");\n                new Uint8Array(this.mem.buffer, offset, bytes.length).set(bytes);\n                offset += bytes.length;\n                if (offset % 8 !== 0) {\n                  offset += 8 - offset % 8;\n                }\n                return ptr;\n              };\n              const argc = this.argv.length;\n              const argvPtrs = [];\n              this.argv.forEach((arg) => {\n                argvPtrs.push(strPtr(arg));\n              });\n              argvPtrs.push(0);\n              const keys = Object.keys(this.env).sort();\n              keys.forEach((key) => {\n                argvPtrs.push(strPtr(`${key}=${this.env[key]}`));\n              });\n              argvPtrs.push(0);\n              const argv = offset;\n              argvPtrs.forEach((ptr) => {\n                this.mem.setUint32(offset, ptr, true);\n                this.mem.setUint32(offset + 4, 0, true);\n                offset += 8;\n              });\n              const wasmMinDataAddr = 4096 + 8192;\n              if (offset >= wasmMinDataAddr) {\n                throw new Error("total length of command line and environment variables exceeds limit");\n              }\n              this._inst.exports.run(argc, argv);\n              if (this.exited) {\n                this._resolveExitPromise();\n              }\n              yield this._exitPromise;\n            });\n          }\n          _resume() {\n            if (this.exited) {\n              throw new Error("Go program has already exited");\n            }\n            this._inst.exports.resume();\n            if (this.exited) {\n              this._resolveExitPromise();\n            }\n          }\n          _makeFuncWrapper(id) {\n            const go = this;\n            return function() {\n              const event = { id, this: this, args: arguments };\n              go._pendingEvent = event;\n              go._resume();\n              return event.result;\n            };\n          }\n        };\n      })();\n      onmessage = ({ data: wasm }) => {\n        let decoder = new TextDecoder();\n        let fs = globalThis.fs;\n        let stderr = "";\n        fs.writeSync = (fd, buffer) => {\n          if (fd === 1) {\n            postMessage(buffer);\n          } else if (fd === 2) {\n            stderr += decoder.decode(buffer);\n            let parts = stderr.split("\\n");\n            if (parts.length > 1) console.log(parts.slice(0, -1).join("\\n"));\n            stderr = parts[parts.length - 1];\n          } else {\n            throw new Error("Bad write");\n          }\n          return buffer.length;\n        };\n        let stdin = [];\n        let resumeStdin;\n        let stdinPos = 0;\n        onmessage = ({ data }) => {\n          if (data.length > 0) {\n            stdin.push(data);\n            if (resumeStdin) resumeStdin();\n          }\n          return go;\n        };\n        fs.read = (fd, buffer, offset, length, position, callback) => {\n          if (fd !== 0 || offset !== 0 || length !== buffer.length || position !== null) {\n            throw new Error("Bad read");\n          }\n          if (stdin.length === 0) {\n            resumeStdin = () => fs.read(fd, buffer, offset, length, position, callback);\n            return;\n          }\n          let first = stdin[0];\n          let count = Math.max(0, Math.min(length, first.length - stdinPos));\n          buffer.set(first.subarray(stdinPos, stdinPos + count), offset);\n          stdinPos += count;\n          if (stdinPos === first.length) {\n            stdin.shift();\n            stdinPos = 0;\n          }\n          callback(null, count);\n        };\n        let go = new globalThis.Go();\n        go.argv = ["", `--service=${"0.27.0"}`];\n        tryToInstantiateModule(wasm, go).then(\n          (instance) => {\n            postMessage(null);\n            go.run(instance);\n          },\n          (error) => {\n            postMessage(error);\n          }\n        );\n        return go;\n      };\n      function tryToInstantiateModule(wasm, go) {\n        return __async(this, null, function* () {\n          if (wasm instanceof WebAssembly.Module) {\n            return WebAssembly.instantiate(wasm, go.importObject);\n          }\n          const res = yield fetch(wasm);\n          if (!res.ok) throw new Error(`Failed to download ${JSON.stringify(wasm)}`);\n          if ("instantiateStreaming" in WebAssembly && /^application\\/wasm($|;)/i.test(res.headers.get("Content-Type") || "")) {\n            const result2 = yield WebAssembly.instantiateStreaming(res, go.importObject);\n            return result2.instance;\n          }\n          const bytes = yield res.arrayBuffer();\n          const result = yield WebAssembly.instantiate(bytes, go.importObject);\n          return result.instance;\n        });\n      }\n      return (m) => onmessage(m);\n    })'}(postMessage)`], { type: "text/javascript" });
          worker = new Worker(URL.createObjectURL(blob));
        } else {
          let onmessage = ((postMessage) => {
            var __async2 = /* @__PURE__ */ __name((__this, __arguments, generator) => {
              return new Promise((resolve, reject) => {
                var fulfilled = /* @__PURE__ */ __name((value) => {
                  try {
                    step(generator.next(value));
                  } catch (e) {
                    reject(e);
                  }
                }, "fulfilled");
                var rejected = /* @__PURE__ */ __name((value) => {
                  try {
                    step(generator.throw(value));
                  } catch (e) {
                    reject(e);
                  }
                }, "rejected");
                var step = /* @__PURE__ */ __name((x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected), "step");
                step((generator = generator.apply(__this, __arguments)).next());
              });
            }, "__async");
            let onmessage2;
            let globalThis = {};
            for (let o = self; o; o = Object.getPrototypeOf(o))
              for (let k of Object.getOwnPropertyNames(o))
                if (!(k in globalThis))
                  Object.defineProperty(globalThis, k, { get: /* @__PURE__ */ __name(() => self[k], "get") });
            "use strict";
            (() => {
              const enosys = /* @__PURE__ */ __name(() => {
                const err = new Error("not implemented");
                err.code = "ENOSYS";
                return err;
              }, "enosys");
              if (!globalThis.fs) {
                let outputBuf = "";
                globalThis.fs = {
                  constants: { O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1, O_DIRECTORY: -1 },
                  // unused
                  writeSync(fd, buf) {
                    outputBuf += decoder.decode(buf);
                    const nl = outputBuf.lastIndexOf("\n");
                    if (nl != -1) {
                      console.log(outputBuf.substring(0, nl));
                      outputBuf = outputBuf.substring(nl + 1);
                    }
                    return buf.length;
                  },
                  write(fd, buf, offset, length, position, callback) {
                    if (offset !== 0 || length !== buf.length || position !== null) {
                      callback(enosys());
                      return;
                    }
                    const n = this.writeSync(fd, buf);
                    callback(null, n);
                  },
                  chmod(path, mode, callback) {
                    callback(enosys());
                  },
                  chown(path, uid, gid, callback) {
                    callback(enosys());
                  },
                  close(fd, callback) {
                    callback(enosys());
                  },
                  fchmod(fd, mode, callback) {
                    callback(enosys());
                  },
                  fchown(fd, uid, gid, callback) {
                    callback(enosys());
                  },
                  fstat(fd, callback) {
                    callback(enosys());
                  },
                  fsync(fd, callback) {
                    callback(null);
                  },
                  ftruncate(fd, length, callback) {
                    callback(enosys());
                  },
                  lchown(path, uid, gid, callback) {
                    callback(enosys());
                  },
                  link(path, link, callback) {
                    callback(enosys());
                  },
                  lstat(path, callback) {
                    callback(enosys());
                  },
                  mkdir(path, perm, callback) {
                    callback(enosys());
                  },
                  open(path, flags, mode, callback) {
                    callback(enosys());
                  },
                  read(fd, buffer, offset, length, position, callback) {
                    callback(enosys());
                  },
                  readdir(path, callback) {
                    callback(enosys());
                  },
                  readlink(path, callback) {
                    callback(enosys());
                  },
                  rename(from, to, callback) {
                    callback(enosys());
                  },
                  rmdir(path, callback) {
                    callback(enosys());
                  },
                  stat(path, callback) {
                    callback(enosys());
                  },
                  symlink(path, link, callback) {
                    callback(enosys());
                  },
                  truncate(path, length, callback) {
                    callback(enosys());
                  },
                  unlink(path, callback) {
                    callback(enosys());
                  },
                  utimes(path, atime, mtime, callback) {
                    callback(enosys());
                  }
                };
              }
              if (!globalThis.process) {
                globalThis.process = {
                  getuid() {
                    return -1;
                  },
                  getgid() {
                    return -1;
                  },
                  geteuid() {
                    return -1;
                  },
                  getegid() {
                    return -1;
                  },
                  getgroups() {
                    throw enosys();
                  },
                  pid: -1,
                  ppid: -1,
                  umask() {
                    throw enosys();
                  },
                  cwd() {
                    throw enosys();
                  },
                  chdir() {
                    throw enosys();
                  }
                };
              }
              if (!globalThis.path) {
                globalThis.path = {
                  resolve(...pathSegments) {
                    return pathSegments.join("/");
                  }
                };
              }
              if (!globalThis.crypto) {
                throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");
              }
              if (!globalThis.performance) {
                throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");
              }
              if (!globalThis.TextEncoder) {
                throw new Error("globalThis.TextEncoder is not available, polyfill required");
              }
              if (!globalThis.TextDecoder) {
                throw new Error("globalThis.TextDecoder is not available, polyfill required");
              }
              const encoder = new TextEncoder("utf-8");
              const decoder = new TextDecoder("utf-8");
              globalThis.Go = class {
                constructor() {
                  this.argv = ["js"];
                  this.env = {};
                  this.exit = (code) => {
                    if (code !== 0) {
                      console.warn("exit code:", code);
                    }
                  };
                  this._exitPromise = new Promise((resolve) => {
                    this._resolveExitPromise = resolve;
                  });
                  this._pendingEvent = null;
                  this._scheduledTimeouts = /* @__PURE__ */ new Map();
                  this._nextCallbackTimeoutID = 1;
                  const setInt64 = /* @__PURE__ */ __name((addr, v) => {
                    this.mem.setUint32(addr + 0, v, true);
                    this.mem.setUint32(addr + 4, Math.floor(v / 4294967296), true);
                  }, "setInt64");
                  const setInt32 = /* @__PURE__ */ __name((addr, v) => {
                    this.mem.setUint32(addr + 0, v, true);
                  }, "setInt32");
                  const getInt64 = /* @__PURE__ */ __name((addr) => {
                    const low = this.mem.getUint32(addr + 0, true);
                    const high = this.mem.getInt32(addr + 4, true);
                    return low + high * 4294967296;
                  }, "getInt64");
                  const loadValue = /* @__PURE__ */ __name((addr) => {
                    const f = this.mem.getFloat64(addr, true);
                    if (f === 0) {
                      return void 0;
                    }
                    if (!isNaN(f)) {
                      return f;
                    }
                    const id = this.mem.getUint32(addr, true);
                    return this._values[id];
                  }, "loadValue");
                  const storeValue = /* @__PURE__ */ __name((addr, v) => {
                    const nanHead = 2146959360;
                    if (typeof v === "number" && v !== 0) {
                      if (isNaN(v)) {
                        this.mem.setUint32(addr + 4, nanHead, true);
                        this.mem.setUint32(addr, 0, true);
                        return;
                      }
                      this.mem.setFloat64(addr, v, true);
                      return;
                    }
                    if (v === void 0) {
                      this.mem.setFloat64(addr, 0, true);
                      return;
                    }
                    let id = this._ids.get(v);
                    if (id === void 0) {
                      id = this._idPool.pop();
                      if (id === void 0) {
                        id = this._values.length;
                      }
                      this._values[id] = v;
                      this._goRefCounts[id] = 0;
                      this._ids.set(v, id);
                    }
                    this._goRefCounts[id]++;
                    let typeFlag = 0;
                    switch (typeof v) {
                      case "object":
                        if (v !== null) {
                          typeFlag = 1;
                        }
                        break;
                      case "string":
                        typeFlag = 2;
                        break;
                      case "symbol":
                        typeFlag = 3;
                        break;
                      case "function":
                        typeFlag = 4;
                        break;
                    }
                    this.mem.setUint32(addr + 4, nanHead | typeFlag, true);
                    this.mem.setUint32(addr, id, true);
                  }, "storeValue");
                  const loadSlice = /* @__PURE__ */ __name((addr) => {
                    const array = getInt64(addr + 0);
                    const len = getInt64(addr + 8);
                    return new Uint8Array(this._inst.exports.mem.buffer, array, len);
                  }, "loadSlice");
                  const loadSliceOfValues = /* @__PURE__ */ __name((addr) => {
                    const array = getInt64(addr + 0);
                    const len = getInt64(addr + 8);
                    const a = new Array(len);
                    for (let i = 0; i < len; i++) {
                      a[i] = loadValue(array + i * 8);
                    }
                    return a;
                  }, "loadSliceOfValues");
                  const loadString = /* @__PURE__ */ __name((addr) => {
                    const saddr = getInt64(addr + 0);
                    const len = getInt64(addr + 8);
                    return decoder.decode(new DataView(this._inst.exports.mem.buffer, saddr, len));
                  }, "loadString");
                  const testCallExport = /* @__PURE__ */ __name((a, b) => {
                    this._inst.exports.testExport0();
                    return this._inst.exports.testExport(a, b);
                  }, "testCallExport");
                  const timeOrigin = Date.now() - performance.now();
                  this.importObject = {
                    _gotest: {
                      add: /* @__PURE__ */ __name((a, b) => a + b, "add"),
                      callExport: testCallExport
                    },
                    gojs: {
                      // Go's SP does not change as long as no Go code is running. Some operations (e.g. calls, getters and setters)
                      // may synchronously trigger a Go event handler. This makes Go code get executed in the middle of the imported
                      // function. A goroutine can switch to a new stack if the current stack is too small (see morestack function).
                      // This changes the SP, thus we have to update the SP used by the imported function.
                      // func wasmExit(code int32)
                      "runtime.wasmExit": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        const code = this.mem.getInt32(sp + 8, true);
                        this.exited = true;
                        delete this._inst;
                        delete this._values;
                        delete this._goRefCounts;
                        delete this._ids;
                        delete this._idPool;
                        this.exit(code);
                      }, "runtime.wasmExit"),
                      // func wasmWrite(fd uintptr, p unsafe.Pointer, n int32)
                      "runtime.wasmWrite": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        const fd = getInt64(sp + 8);
                        const p = getInt64(sp + 16);
                        const n = this.mem.getInt32(sp + 24, true);
                        globalThis.fs.writeSync(fd, new Uint8Array(this._inst.exports.mem.buffer, p, n));
                      }, "runtime.wasmWrite"),
                      // func resetMemoryDataView()
                      "runtime.resetMemoryDataView": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        this.mem = new DataView(this._inst.exports.mem.buffer);
                      }, "runtime.resetMemoryDataView"),
                      // func nanotime1() int64
                      "runtime.nanotime1": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        setInt64(sp + 8, (timeOrigin + performance.now()) * 1e6);
                      }, "runtime.nanotime1"),
                      // func walltime() (sec int64, nsec int32)
                      "runtime.walltime": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        const msec = (/* @__PURE__ */ new Date()).getTime();
                        setInt64(sp + 8, msec / 1e3);
                        this.mem.setInt32(sp + 16, msec % 1e3 * 1e6, true);
                      }, "runtime.walltime"),
                      // func scheduleTimeoutEvent(delay int64) int32
                      "runtime.scheduleTimeoutEvent": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        const id = this._nextCallbackTimeoutID;
                        this._nextCallbackTimeoutID++;
                        this._scheduledTimeouts.set(id, setTimeout(
                          () => {
                            this._resume();
                            while (this._scheduledTimeouts.has(id)) {
                              console.warn("scheduleTimeoutEvent: missed timeout event");
                              this._resume();
                            }
                          },
                          getInt64(sp + 8)
                        ));
                        this.mem.setInt32(sp + 16, id, true);
                      }, "runtime.scheduleTimeoutEvent"),
                      // func clearTimeoutEvent(id int32)
                      "runtime.clearTimeoutEvent": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        const id = this.mem.getInt32(sp + 8, true);
                        clearTimeout(this._scheduledTimeouts.get(id));
                        this._scheduledTimeouts.delete(id);
                      }, "runtime.clearTimeoutEvent"),
                      // func getRandomData(r []byte)
                      "runtime.getRandomData": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        crypto.getRandomValues(loadSlice(sp + 8));
                      }, "runtime.getRandomData"),
                      // func finalizeRef(v ref)
                      "syscall/js.finalizeRef": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        const id = this.mem.getUint32(sp + 8, true);
                        this._goRefCounts[id]--;
                        if (this._goRefCounts[id] === 0) {
                          const v = this._values[id];
                          this._values[id] = null;
                          this._ids.delete(v);
                          this._idPool.push(id);
                        }
                      }, "syscall/js.finalizeRef"),
                      // func stringVal(value string) ref
                      "syscall/js.stringVal": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        storeValue(sp + 24, loadString(sp + 8));
                      }, "syscall/js.stringVal"),
                      // func valueGet(v ref, p string) ref
                      "syscall/js.valueGet": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        const result = Reflect.get(loadValue(sp + 8), loadString(sp + 16));
                        sp = this._inst.exports.getsp() >>> 0;
                        storeValue(sp + 32, result);
                      }, "syscall/js.valueGet"),
                      // func valueSet(v ref, p string, x ref)
                      "syscall/js.valueSet": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        Reflect.set(loadValue(sp + 8), loadString(sp + 16), loadValue(sp + 32));
                      }, "syscall/js.valueSet"),
                      // func valueDelete(v ref, p string)
                      "syscall/js.valueDelete": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        Reflect.deleteProperty(loadValue(sp + 8), loadString(sp + 16));
                      }, "syscall/js.valueDelete"),
                      // func valueIndex(v ref, i int) ref
                      "syscall/js.valueIndex": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        storeValue(sp + 24, Reflect.get(loadValue(sp + 8), getInt64(sp + 16)));
                      }, "syscall/js.valueIndex"),
                      // valueSetIndex(v ref, i int, x ref)
                      "syscall/js.valueSetIndex": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        Reflect.set(loadValue(sp + 8), getInt64(sp + 16), loadValue(sp + 24));
                      }, "syscall/js.valueSetIndex"),
                      // func valueCall(v ref, m string, args []ref) (ref, bool)
                      "syscall/js.valueCall": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        try {
                          const v = loadValue(sp + 8);
                          const m = Reflect.get(v, loadString(sp + 16));
                          const args = loadSliceOfValues(sp + 32);
                          const result = Reflect.apply(m, v, args);
                          sp = this._inst.exports.getsp() >>> 0;
                          storeValue(sp + 56, result);
                          this.mem.setUint8(sp + 64, 1);
                        } catch (err) {
                          sp = this._inst.exports.getsp() >>> 0;
                          storeValue(sp + 56, err);
                          this.mem.setUint8(sp + 64, 0);
                        }
                      }, "syscall/js.valueCall"),
                      // func valueInvoke(v ref, args []ref) (ref, bool)
                      "syscall/js.valueInvoke": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        try {
                          const v = loadValue(sp + 8);
                          const args = loadSliceOfValues(sp + 16);
                          const result = Reflect.apply(v, void 0, args);
                          sp = this._inst.exports.getsp() >>> 0;
                          storeValue(sp + 40, result);
                          this.mem.setUint8(sp + 48, 1);
                        } catch (err) {
                          sp = this._inst.exports.getsp() >>> 0;
                          storeValue(sp + 40, err);
                          this.mem.setUint8(sp + 48, 0);
                        }
                      }, "syscall/js.valueInvoke"),
                      // func valueNew(v ref, args []ref) (ref, bool)
                      "syscall/js.valueNew": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        try {
                          const v = loadValue(sp + 8);
                          const args = loadSliceOfValues(sp + 16);
                          const result = Reflect.construct(v, args);
                          sp = this._inst.exports.getsp() >>> 0;
                          storeValue(sp + 40, result);
                          this.mem.setUint8(sp + 48, 1);
                        } catch (err) {
                          sp = this._inst.exports.getsp() >>> 0;
                          storeValue(sp + 40, err);
                          this.mem.setUint8(sp + 48, 0);
                        }
                      }, "syscall/js.valueNew"),
                      // func valueLength(v ref) int
                      "syscall/js.valueLength": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        setInt64(sp + 16, parseInt(loadValue(sp + 8).length));
                      }, "syscall/js.valueLength"),
                      // valuePrepareString(v ref) (ref, int)
                      "syscall/js.valuePrepareString": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        const str = encoder.encode(String(loadValue(sp + 8)));
                        storeValue(sp + 16, str);
                        setInt64(sp + 24, str.length);
                      }, "syscall/js.valuePrepareString"),
                      // valueLoadString(v ref, b []byte)
                      "syscall/js.valueLoadString": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        const str = loadValue(sp + 8);
                        loadSlice(sp + 16).set(str);
                      }, "syscall/js.valueLoadString"),
                      // func valueInstanceOf(v ref, t ref) bool
                      "syscall/js.valueInstanceOf": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        this.mem.setUint8(sp + 24, loadValue(sp + 8) instanceof loadValue(sp + 16) ? 1 : 0);
                      }, "syscall/js.valueInstanceOf"),
                      // func copyBytesToGo(dst []byte, src ref) (int, bool)
                      "syscall/js.copyBytesToGo": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        const dst = loadSlice(sp + 8);
                        const src = loadValue(sp + 32);
                        if (!(src instanceof Uint8Array || src instanceof Uint8ClampedArray)) {
                          this.mem.setUint8(sp + 48, 0);
                          return;
                        }
                        const toCopy = src.subarray(0, dst.length);
                        dst.set(toCopy);
                        setInt64(sp + 40, toCopy.length);
                        this.mem.setUint8(sp + 48, 1);
                      }, "syscall/js.copyBytesToGo"),
                      // func copyBytesToJS(dst ref, src []byte) (int, bool)
                      "syscall/js.copyBytesToJS": /* @__PURE__ */ __name((sp) => {
                        sp >>>= 0;
                        const dst = loadValue(sp + 8);
                        const src = loadSlice(sp + 16);
                        if (!(dst instanceof Uint8Array || dst instanceof Uint8ClampedArray)) {
                          this.mem.setUint8(sp + 48, 0);
                          return;
                        }
                        const toCopy = src.subarray(0, dst.length);
                        dst.set(toCopy);
                        setInt64(sp + 40, toCopy.length);
                        this.mem.setUint8(sp + 48, 1);
                      }, "syscall/js.copyBytesToJS"),
                      "debug": /* @__PURE__ */ __name((value) => {
                        console.log(value);
                      }, "debug")
                    }
                  };
                }
                run(instance) {
                  return __async2(this, null, function* () {
                    if (!(instance instanceof WebAssembly.Instance)) {
                      throw new Error("Go.run: WebAssembly.Instance expected");
                    }
                    this._inst = instance;
                    this.mem = new DataView(this._inst.exports.mem.buffer);
                    this._values = [
                      // JS values that Go currently has references to, indexed by reference id
                      NaN,
                      0,
                      null,
                      true,
                      false,
                      globalThis,
                      this
                    ];
                    this._goRefCounts = new Array(this._values.length).fill(Infinity);
                    this._ids = /* @__PURE__ */ new Map([
                      // mapping from JS values to reference ids
                      [0, 1],
                      [null, 2],
                      [true, 3],
                      [false, 4],
                      [globalThis, 5],
                      [this, 6]
                    ]);
                    this._idPool = [];
                    this.exited = false;
                    let offset = 4096;
                    const strPtr = /* @__PURE__ */ __name((str) => {
                      const ptr = offset;
                      const bytes = encoder.encode(str + "\0");
                      new Uint8Array(this.mem.buffer, offset, bytes.length).set(bytes);
                      offset += bytes.length;
                      if (offset % 8 !== 0) {
                        offset += 8 - offset % 8;
                      }
                      return ptr;
                    }, "strPtr");
                    const argc = this.argv.length;
                    const argvPtrs = [];
                    this.argv.forEach((arg) => {
                      argvPtrs.push(strPtr(arg));
                    });
                    argvPtrs.push(0);
                    const keys = Object.keys(this.env).sort();
                    keys.forEach((key) => {
                      argvPtrs.push(strPtr(`${key}=${this.env[key]}`));
                    });
                    argvPtrs.push(0);
                    const argv = offset;
                    argvPtrs.forEach((ptr) => {
                      this.mem.setUint32(offset, ptr, true);
                      this.mem.setUint32(offset + 4, 0, true);
                      offset += 8;
                    });
                    const wasmMinDataAddr = 4096 + 8192;
                    if (offset >= wasmMinDataAddr) {
                      throw new Error("total length of command line and environment variables exceeds limit");
                    }
                    this._inst.exports.run(argc, argv);
                    if (this.exited) {
                      this._resolveExitPromise();
                    }
                    yield this._exitPromise;
                  });
                }
                _resume() {
                  if (this.exited) {
                    throw new Error("Go program has already exited");
                  }
                  this._inst.exports.resume();
                  if (this.exited) {
                    this._resolveExitPromise();
                  }
                }
                _makeFuncWrapper(id) {
                  const go2 = this;
                  return function() {
                    const event = { id, this: this, args: arguments };
                    go2._pendingEvent = event;
                    go2._resume();
                    return event.result;
                  };
                }
              };
            })();
            onmessage2 = /* @__PURE__ */ __name(({ data: wasm }) => {
              let decoder = new TextDecoder();
              let fs = globalThis.fs;
              let stderr = "";
              fs.writeSync = (fd, buffer) => {
                if (fd === 1) {
                  postMessage(buffer);
                } else if (fd === 2) {
                  stderr += decoder.decode(buffer);
                  let parts = stderr.split("\n");
                  if (parts.length > 1) console.log(parts.slice(0, -1).join("\n"));
                  stderr = parts[parts.length - 1];
                } else {
                  throw new Error("Bad write");
                }
                return buffer.length;
              };
              let stdin = [];
              let resumeStdin;
              let stdinPos = 0;
              onmessage2 = /* @__PURE__ */ __name(({ data }) => {
                if (data.length > 0) {
                  stdin.push(data);
                  if (resumeStdin) resumeStdin();
                }
                return go2;
              }, "onmessage");
              fs.read = (fd, buffer, offset, length, position, callback) => {
                if (fd !== 0 || offset !== 0 || length !== buffer.length || position !== null) {
                  throw new Error("Bad read");
                }
                if (stdin.length === 0) {
                  resumeStdin = /* @__PURE__ */ __name(() => fs.read(fd, buffer, offset, length, position, callback), "resumeStdin");
                  return;
                }
                let first = stdin[0];
                let count = Math.max(0, Math.min(length, first.length - stdinPos));
                buffer.set(first.subarray(stdinPos, stdinPos + count), offset);
                stdinPos += count;
                if (stdinPos === first.length) {
                  stdin.shift();
                  stdinPos = 0;
                }
                callback(null, count);
              };
              let go2 = new globalThis.Go();
              go2.argv = ["", `--service=${"0.27.0"}`];
              tryToInstantiateModule(wasm, go2).then(
                (instance) => {
                  postMessage(null);
                  go2.run(instance);
                },
                (error) => {
                  postMessage(error);
                }
              );
              return go2;
            }, "onmessage");
            function tryToInstantiateModule(wasm, go2) {
              return __async2(this, null, function* () {
                if (wasm instanceof WebAssembly.Module) {
                  return WebAssembly.instantiate(wasm, go2.importObject);
                }
                const res = yield fetch(wasm);
                if (!res.ok) throw new Error(`Failed to download ${JSON.stringify(wasm)}`);
                if ("instantiateStreaming" in WebAssembly && /^application\/wasm($|;)/i.test(res.headers.get("Content-Type") || "")) {
                  const result2 = yield WebAssembly.instantiateStreaming(res, go2.importObject);
                  return result2.instance;
                }
                const bytes = yield res.arrayBuffer();
                const result = yield WebAssembly.instantiate(bytes, go2.importObject);
                return result.instance;
              });
            }
            __name(tryToInstantiateModule, "tryToInstantiateModule");
            return (m) => onmessage2(m);
          })((data) => worker.onmessage({ data }));
          let go;
          worker = {
            onmessage: null,
            postMessage: /* @__PURE__ */ __name((data) => setTimeout(() => {
              try {
                go = onmessage({ data });
              } catch (error) {
                rejectAllWith(error);
              }
            }), "postMessage"),
            terminate() {
              if (go)
                for (let timeout of go._scheduledTimeouts.values())
                  clearTimeout(timeout);
            }
          };
        }
        let firstMessageResolve;
        let firstMessageReject;
        const firstMessagePromise = new Promise((resolve, reject) => {
          firstMessageResolve = resolve;
          firstMessageReject = reject;
        });
        worker.onmessage = ({ data: error }) => {
          worker.onmessage = ({ data }) => readFromStdout(data);
          if (error) firstMessageReject(error);
          else firstMessageResolve();
        };
        worker.postMessage(wasmModule || new URL(wasmURL, location.href).toString());
        let { readFromStdout, service } = createChannel({
          writeToStdin(bytes) {
            worker.postMessage(bytes);
          },
          isSync: false,
          hasFS: false,
          esbuild: browser_exports
        });
        yield firstMessagePromise;
        stopService = /* @__PURE__ */ __name(() => {
          worker.terminate();
          initializePromise = void 0;
          stopService = void 0;
          longLivedService = void 0;
        }, "stopService");
        longLivedService = {
          build: /* @__PURE__ */ __name((options) => new Promise((resolve, reject) => {
            rejectAllPromise.then(reject);
            service.buildOrContext({
              callName: "build",
              refs: null,
              options,
              isTTY: false,
              defaultWD: "/",
              callback: /* @__PURE__ */ __name((err, res) => err ? reject(err) : resolve(res), "callback")
            });
          }), "build"),
          context: /* @__PURE__ */ __name((options) => new Promise((resolve, reject) => {
            rejectAllPromise.then(reject);
            service.buildOrContext({
              callName: "context",
              refs: null,
              options,
              isTTY: false,
              defaultWD: "/",
              callback: /* @__PURE__ */ __name((err, res) => err ? reject(err) : resolve(res), "callback")
            });
          }), "context"),
          transform: /* @__PURE__ */ __name((input, options) => new Promise((resolve, reject) => {
            rejectAllPromise.then(reject);
            service.transform({
              callName: "transform",
              refs: null,
              input,
              options: options || {},
              isTTY: false,
              fs: {
                readFile(_, callback) {
                  callback(new Error("Internal error"), null);
                },
                writeFile(_, callback) {
                  callback(null);
                }
              },
              callback: /* @__PURE__ */ __name((err, res) => err ? reject(err) : resolve(res), "callback")
            });
          }), "transform"),
          formatMessages: /* @__PURE__ */ __name((messages, options) => new Promise((resolve, reject) => {
            rejectAllPromise.then(reject);
            service.formatMessages({
              callName: "formatMessages",
              refs: null,
              messages,
              options,
              callback: /* @__PURE__ */ __name((err, res) => err ? reject(err) : resolve(res), "callback")
            });
          }), "formatMessages"),
          analyzeMetafile: /* @__PURE__ */ __name((metafile, options) => new Promise((resolve, reject) => {
            rejectAllPromise.then(reject);
            service.analyzeMetafile({
              callName: "analyzeMetafile",
              refs: null,
              metafile: typeof metafile === "string" ? metafile : JSON.stringify(metafile),
              options,
              callback: /* @__PURE__ */ __name((err, res) => err ? reject(err) : resolve(res), "callback")
            });
          }), "analyzeMetafile")
        };
      }), "startRunningService");
      var browser_default = browser_exports;
    })(typeof module === "object" ? module : { set exports(x) {
      (typeof self !== "undefined" ? self : this).esbuild = x;
    } });
  }
});

// extensions/react-preview/index.tsx
const React = window.__PYXIS_REACT__; const {useState, useEffect, useRef} = React;
var esbuildInstance = null;
var isInitializing = false;
async function loadESBuild() {
  if (esbuildInstance) return esbuildInstance;
  if (isInitializing) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return loadESBuild();
  }
  isInitializing = true;
  try {
    const esbuildModule = await Promise.resolve().then(() => __toESM(require_browser()));
    const esbuild = esbuildModule.default || esbuildModule;
    if (esbuildInstance) {
      isInitializing = false;
      return esbuildInstance;
    }
    const runtimeBase = typeof window !== "undefined" && window.__NEXT_PUBLIC_BASE_PATH__ || "";
    const normalizedBase = runtimeBase.endsWith("/") ? runtimeBase.slice(0, -1) : runtimeBase;
    const wasmURL = `${normalizedBase}/extensions/react-preview/esbuild.wasm`;
    await esbuild.initialize({ wasmURL });
    esbuildInstance = esbuild;
    return esbuild;
  } finally {
    isInitializing = false;
  }
}
__name(loadESBuild, "loadESBuild");
function createGlobalExternalsPlugin() {
  return {
    name: "global-externals",
    setup(build) {
      const globalMap = {
        "react": "React",
        "react-dom": "ReactDOM",
        "react-dom/client": "ReactDOM"
      };
      build.onResolve({ filter: /^react(-dom)?(\/client)?$/ }, (args) => {
        return {
          path: args.path,
          namespace: "global-external"
        };
      });
      build.onLoad({ filter: /.*/, namespace: "global-external" }, (args) => {
        const globalName = globalMap[args.path];
        if (!globalName) {
          return { errors: [{ text: `No global mapping for ${args.path}` }] };
        }
        const code = `module.exports = window.${globalName};`;
        return { contents: code, loader: "js" };
      });
    }
  };
}
__name(createGlobalExternalsPlugin, "createGlobalExternalsPlugin");
function createVirtualFSPlugin(projectId, fileRepository) {
  return {
    name: "virtual-fs",
    setup(build) {
      build.onResolve({ filter: /^[^./]/ }, async (args) => {
        if (args.path === "react" || args.path === "react-dom" || args.path === "react-dom/client") {
          return void 0;
        }
        try {
          const pkgJsonPath = `/node_modules/${args.path}/package.json`;
          const pkgJsonFile = await fileRepository.getFileByPath(projectId, pkgJsonPath);
          if (pkgJsonFile) {
            const pkgJson = JSON.parse(pkgJsonFile.content);
            const entryPoint = pkgJson.module || pkgJson.main || "index.js";
            const resolvedPath = `/node_modules/${args.path}/${entryPoint}`;
            return { path: resolvedPath, namespace: "virtual" };
          }
        } catch (e) {
          console.error(`Failed to resolve package.json for ${args.path}:`, e);
        }
        try {
          const distIndexPath = `/node_modules/${args.path}/dist/index.js`;
          const file = await fileRepository.getFileByPath(projectId, distIndexPath);
          if (file) {
            return { path: distIndexPath, namespace: "virtual" };
          }
        } catch (e) {
        }
        return { path: args.path, external: true };
      });
      build.onResolve({ filter: /^\./ }, async (args) => {
        const fromDir = args.importer === "<stdin>" ? args.resolveDir : args.importer.split("/").slice(0, -1).join("/");
        const parts = (fromDir + "/" + args.path).split("/");
        const resolved = [];
        for (const part of parts) {
          if (part === "" || part === ".") continue;
          if (part === "..") {
            if (resolved.length > 0) resolved.pop();
            continue;
          }
          resolved.push(part);
        }
        let path = "/" + resolved.join("/");
        if (!path.match(/\.[^/]+$/)) {
          for (const ext of [".js", ".ts", ".jsx", ".tsx"]) {
            try {
              const testPath = path + ext;
              const file = await fileRepository.getFileByPath(projectId, testPath);
              if (file) {
                return { path: testPath, namespace: "virtual" };
              }
            } catch (e) {
            }
          }
          try {
            const indexPath = path + "/index.js";
            const file = await fileRepository.getFileByPath(projectId, indexPath);
            if (file) {
              return { path: indexPath, namespace: "virtual" };
            }
          } catch (e) {
          }
        }
        return { path, namespace: "virtual" };
      });
      build.onLoad({ filter: /.*/, namespace: "virtual" }, async (args) => {
        const file = await fileRepository.getFileByPath(projectId, args.path);
        if (!file) {
          return { errors: [{ text: `File not found: ${args.path}` }] };
        }
        if (args.path.match(/\.css$/i)) {
          const cssContent = JSON.stringify(file.content);
          const code = `
            (function() {
              var style = document.createElement('style');
              style.textContent = ${cssContent};
              style.setAttribute('data-react-preview', '${args.path}');
              document.head.appendChild(style);
            })();
          `;
          return { contents: code, loader: "js" };
        }
        if (args.path.match(/\.(png|jpe?g|svg|gif|webp)$/i)) {
          return { contents: "", loader: "text" };
        }
        let loader = "js";
        if (args.path.endsWith(".tsx")) loader = "tsx";
        else if (args.path.endsWith(".ts")) loader = "ts";
        else if (args.path.endsWith(".jsx")) loader = "jsx";
        return {
          contents: file.content,
          loader
        };
      });
    }
  };
}
__name(createVirtualFSPlugin, "createVirtualFSPlugin");
async function detectPages(projectId, context) {
  const fileRepository = await context.getSystemModule("fileRepository");
  const allFiles = await fileRepository.getProjectFiles(projectId);
  const pageFiles = allFiles.filter((f) => {
    const path = f.path || "";
    return path.match(/^\/pages\/.+\.(jsx|tsx)$/);
  });
  const pages = [];
  for (const file of pageFiles) {
    const filePath = file.path;
    let route = filePath.replace(/^\/pages/, "").replace(/\.(jsx|tsx)$/, "").replace(/\/index$/, "");
    if (route === "") route = "/";
    if (route !== "/" && !route.startsWith("/")) route = "/" + route;
    pages.push({
      path: file.path,
      route,
      filePath
    });
  }
  pages.sort((a, b) => a.route.localeCompare(b.route));
  return pages;
}
__name(detectPages, "detectPages");
async function buildJSX(filePath, projectId, context, globalName = "__ReactApp__") {
  try {
    const esbuild = await loadESBuild();
    const fileRepository = await context.getSystemModule("fileRepository");
    const file = await fileRepository.getFileByPath(projectId, filePath);
    if (!file) {
      return { code: "", error: `File not found: ${filePath}` };
    }
    const result = await esbuild.build({
      stdin: {
        contents: file.content,
        resolveDir: filePath.split("/").slice(0, -1).join("/") || "/",
        sourcefile: filePath,
        loader: filePath.endsWith(".tsx") ? "tsx" : "jsx"
      },
      bundle: true,
      format: "iife",
      globalName,
      write: false,
      plugins: [createGlobalExternalsPlugin(), createVirtualFSPlugin(projectId, fileRepository)],
      target: "es2020",
      jsxFactory: "React.createElement",
      jsxFragment: "React.Fragment",
      define: {
        "process.env.NODE_ENV": '"production"'
      }
    });
    const bundled = result.outputFiles[0].text;
    return { code: bundled };
  } catch (error) {
    return { code: "", error: error?.message || "Build failed" };
  }
}
__name(buildJSX, "buildJSX");
async function buildMultiPage(pages, projectId, context) {
  const bundledPages = {};
  const errors = {};
  for (const page of pages) {
    const globalName = `__Page_${page.route.replace(/\//g, "_").replace(/^_$/, "root")}__`;
    const { code, error } = await buildJSX(page.filePath, projectId, context, globalName);
    if (error) {
      errors[page.route] = error;
    } else {
      bundledPages[page.route] = code;
    }
  }
  return { bundledPages, errors };
}
__name(buildMultiPage, "buildMultiPage");
async function reactBuildCommand(args, context) {
  if (args.length === 0) {
    return "Usage: react-build <entry.jsx|pages> [--tailwind]\n\nExamples:\n  react-build App.jsx              # Single component\n  react-build App.jsx --tailwind   # With Tailwind CSS\n  react-build pages                # Multi-page app (auto-detect /pages/)\n  react-build pages --tailwind     # Multi-page with Tailwind";
  }
  const target = args[0];
  const useTailwind = args.includes("--tailwind");
  if (target === "pages") {
    const pages = await detectPages(context.projectId, context);
    if (pages.length === 0) {
      return "\u274C No pages found in /pages/ directory.\n\nCreate pages like:\n  /pages/index.tsx\n  /pages/about.tsx\n  /pages/blog/index.tsx";
    }
    const { bundledPages, errors } = await buildMultiPage(pages, context.projectId, context);
    if (Object.keys(errors).length > 0) {
      let errorMsg = "\u274C Some pages failed to build:\n";
      for (const [route, error2] of Object.entries(errors)) {
        errorMsg += `
  ${route}: ${error2}`;
      }
      return errorMsg;
    }
    context.tabs.createTab({
      id: `preview-multipage-${Date.now()}`,
      title: "Preview: Multi-page App",
      icon: "Eye",
      closable: true,
      activateAfterCreate: true,
      data: {
        mode: "multipage",
        pages,
        bundledPages,
        builtAt: Date.now(),
        useTailwind
      }
    });
    const pageList = pages.map((p) => `  ${p.route} \u2192 ${p.filePath}`).join("\n");
    const tailwindMsg2 = useTailwind ? "\n\u{1F3A8} Tailwind CSS enabled" : "";
    return `[react-preview] Building multi-page app...
\u2705 Built ${pages.length} pages:${tailwindMsg2}

${pageList}

\u{1F4FA} Preview opened in tab`;
  }
  const filePath = target;
  let normalizedPath = filePath;
  if (!filePath.startsWith("/")) {
    const relativeCurrent = (context.currentDirectory || "").replace(`/projects/${context.projectName}`, "");
    normalizedPath = relativeCurrent === "" ? `/${filePath}` : `${relativeCurrent}/${filePath}`;
  } else {
    normalizedPath = filePath.replace(`/projects/${context.projectName}`, "");
  }
  const { code, error } = await buildJSX(
    normalizedPath,
    context.projectId,
    context
  );
  if (error) {
    return `[react-preview] Building: ${filePath}
\u274C Build failed:
${error}
`;
  }
  context.tabs.createTab({
    id: `preview-${normalizedPath}`,
    title: `Preview: ${normalizedPath}`,
    icon: "Eye",
    closable: true,
    activateAfterCreate: true,
    data: {
      mode: "single",
      filePath: normalizedPath,
      code,
      builtAt: Date.now(),
      useTailwind
    }
  });
  const tailwindMsg = useTailwind ? "\n\u{1F3A8} Tailwind CSS enabled" : "";
  return `[react-preview] Building: ${filePath}
\u2705 Build successful!${tailwindMsg}

\u{1F4FA} Preview opened in tab
`;
}
__name(reactBuildCommand, "reactBuildCommand");
function ReactPreviewTabComponent({ tab, isActive }) {
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);
  const data = tab.data || {};
  const mode = data.mode || "single";
  const useTailwind = data.useTailwind || false;
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!isActive) {
      initializedRef.current = false;
      return;
    }
    const iframe = iframeRef.current;
    if (!iframe || initializedRef.current) return;
    const initIframe = /* @__PURE__ */ __name(() => {
      const doc = iframe.contentDocument;
      if (!doc) {
        setError("Cannot access iframe document");
        return;
      }
      try {
        let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src *; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data: blob:; font-src * data:; connect-src *; frame-src *;">
  <script src="https://cdn.jsdelivr.net/npm/eruda"><\/script>
  <script>eruda.init();<\/script>
  <style>
    body { margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    #root { width: 100%; min-height: 100vh; }
  </style>`;
        if (useTailwind) {
          html += '\n  <script src="https://cdn.tailwindcss.com"><\/script>';
        }
        html += `
</head>
<body>
  <div id="root"></div>
  
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>
`;
        if (mode === "single") {
          html += `  
  <script>
    ${data.code}
  <\/script>
  
  <script>
    try {
      const Component = window.__ReactApp__.default || window.__ReactApp__;
      
      if (!Component) {
        throw new Error('No component exported from ${data.filePath}');
      }

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(Component));
      
    } catch (err) {
      document.getElementById('root').innerHTML = '<div style="color: #f88; padding: 16px; font-family: monospace; font-size: 12px; white-space: pre-wrap;">Error: ' + (err?.stack || err?.message || String(err)) + '</div>';
      console.error('[ReactPreview]', err);
    }
  <\/script>`;
        } else {
          const pages = data.pages || [];
          const bundledPages = data.bundledPages || {};
          for (const [route, code] of Object.entries(bundledPages)) {
            html += `  <script>${code}<\/script>
`;
          }
          const routeMap = pages.map((p) => {
            const globalName = `__Page_${p.route.replace(/\//g, "_").replace(/^_$/, "root")}__`;
            return `    '${p.route}': window.${globalName}.default || window.${globalName}`;
          }).join(",\n");
          html += `
  <script>
    const routes = {
${routeMap}
    };

    let currentRoot = null;

    function navigate(path) {
      const Component = routes[path];
      
      if (!Component) {
        document.getElementById('root').innerHTML = '<div style="padding: 16px;"><h1>404 Not Found</h1><p>Page "' + path + '" does not exist.</p><p>Available routes:</p><ul>' + 
          Object.keys(routes).map(r => '<li><a href="#' + r + '">' + r + '</a></li>').join('') + 
          '</ul></div>';
        return;
      }

      if (!currentRoot) {
        currentRoot = ReactDOM.createRoot(document.getElementById('root'));
      }
      
      try {
        currentRoot.render(React.createElement(Component));
      } catch (err) {
        document.getElementById('root').innerHTML = '<div style="color: #f88; padding: 16px; font-family: monospace; font-size: 12px; white-space: pre-wrap;">Error rendering ' + path + ':\\n' + (err?.stack || err?.message || String(err)) + '</div>';
        console.error('[ReactPreview]', err);
      }
    }

    function handleRouteChange() {
      const hash = window.location.hash.slice(1) || '/';
      navigate(hash);
    }

    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();
  <\/script>`;
        }
        html += `
</body>
</html>`;
        doc.open();
        doc.write(html);
        doc.close();
        initializedRef.current = true;
        setError(null);
      } catch (err) {
        setError(err?.message || "Failed to initialize iframe");
      }
    }, "initIframe");
    if (iframe.contentDocument?.readyState === "complete") {
      initIframe();
    } else {
      iframe.onload = initIframe;
    }
  }, [isActive, data, mode, useTailwind]);
  return /* @__PURE__ */ React.createElement("div", { style: { width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#1e1e1e", color: "#d4d4d4" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px", borderBottom: "1px solid #333" } }, /* @__PURE__ */ React.createElement("p", { style: { margin: "4px 0 0", fontSize: "12px", color: "#888" } }, mode === "multipage" && `Multi-page app (${data.pages?.length || 0} pages) | `, "Built at: ", data.builtAt ? new Date(data.builtAt).toLocaleString() : "N/A", useTailwind && " | Tailwind CSS enabled")), error && /* @__PURE__ */ React.createElement("div", { style: { padding: "16px", background: "#3e1e1e", color: "#f88", fontFamily: "monospace", fontSize: "12px", whiteSpace: "pre-wrap" } }, "\u274C Error: ", error), /* @__PURE__ */ React.createElement(
    "iframe",
    {
      ref: iframeRef,
      style: {
        flex: 1,
        border: "none",
        background: "#fff"
      },
      title: "React Preview",
      sandbox: "allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-presentation allow-pointer-lock allow-top-navigation",
      allow: "*"
    }
  ));
}
__name(ReactPreviewTabComponent, "ReactPreviewTabComponent");
async function activate(context) {
  context.logger.info("react-preview activating...");
  context.tabs.registerTabType(ReactPreviewTabComponent);
  context.commands.registerCommand("react-build", reactBuildCommand);
  loadESBuild().catch((err) => {
    context.logger.error("Failed to preload esbuild:", err);
  });
  context.logger.info("react-preview activated");
  return {};
}
__name(activate, "activate");
async function deactivate() {
  esbuildInstance = null;
}
__name(deactivate, "deactivate");
export {
  activate,
  deactivate
};
