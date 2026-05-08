/**
 * Extension System Types (Extension-Facing)
 *
 * This file contains the stable, extension-facing types. It is intentionally
 * focused and minimal so extension authors have a clear import surface.
 * Internal/engine types live under `src/engine/...` and should not be
 * imported by extensions.
 *
 * 拡張機能開発者向けの型定義
 * エンジン側の実装と一致していますが、ファイルとしては完全に独立しています。
 */
/**
 * 拡張機能の種類
 * Extension categories; stable values consumed by extension manifests.
 */
export var ExtensionType;
(function (ExtensionType) {
    ExtensionType["BUILTIN_MODULE"] = "builtin-module";
    ExtensionType["SERVICE"] = "service";
    ExtensionType["TRANSPILER"] = "transpiler";
    ExtensionType["LANGUAGE_RUNTIME"] = "language-runtime";
    ExtensionType["TOOL"] = "tool";
    ExtensionType["UI"] = "ui";
})(ExtensionType || (ExtensionType = {}));
