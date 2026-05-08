/**
 * Pyxis TypeScript Runtime Extension
 *
 * TypeScript/JSX/TSXファイルのトランスパイルをサポート
 * Web Workerを使用してメインスレッドをブロックしない
 */
export async function activate(context) {
    context.logger.info('TypeScript Runtime Extension activating...');
    // normalizeCjsEsmユーティリティを取得（型推論により自動的に正しい型が得られる）
    if (!context.getSystemModule) {
        throw new Error('getSystemModule not available');
    }
    let normalizeCjsEsm;
    try {
        // moduleの型は自動的に NormalizeCjsEsmModule として推論される
        const module = await context.getSystemModule('normalizeCjsEsm');
        normalizeCjsEsm = module.normalizeCjsEsm;
        context.logger.info('✅ normalizeCjsEsm loaded');
    }
    catch (error) {
        context.logger.warn('⚠️ Failed to load normalizeCjsEsm:', error);
        throw new Error('normalizeCjsEsm is required but could not be loaded');
    }
    /**
     * 依存関係を抽出
     */
    function extractDependencies(code) {
        const dependencies = new Set();
        const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
        let match;
        while ((match = requireRegex.exec(code)) !== null) {
            dependencies.add(match[1]);
        }
        const importRegex = /import\s+(?:[\w*{}\s,]+\s+from\s+)?['"]([^'"]+)['"]/g;
        while ((match = importRegex.exec(code)) !== null) {
            dependencies.add(match[1]);
        }
        return Array.from(dependencies);
    }
    /**
     * Web Workerを使用してトランスパイル
     * transpile.worker.tsファイルを使用
     */
    async function transpileWithWorker(code, filePath, isTypeScript, isJSX) {
        return new Promise((resolve, reject) => {
            const id = `transpile_${Date.now()}_${Math.random()}`;
            try {
                // Workerファイルのパスを取得
                // NEXT_PUBLIC_BASE_PATHを考慮してパスを構築
                const basePath = typeof window !== 'undefined'
                    ? window.__NEXT_PUBLIC_BASE_PATH__ || ''
                    : '';
                const workerPath = `${basePath}/extensions/typescript-runtime/transpile.worker.js`;
                context.logger.info(`📦 Loading worker from: ${workerPath}`);
                let worker;
                try {
                    worker = new Worker(workerPath);
                }
                catch (workerError) {
                    const errorMsg = `Failed to create Worker from ${workerPath}: ${workerError instanceof Error ? workerError.message : String(workerError)}`;
                    context.logger.error(`🔴 ${errorMsg}`);
                    reject(new Error(errorMsg));
                    return;
                }
                // タイムアウト設定
                const timeout = setTimeout(() => {
                    worker.terminate();
                    reject(new Error('Transpile timeout'));
                }, 30000); // 30秒
                worker.onmessage = (event) => {
                    const data = event.data;
                    // 初期化メッセージは無視
                    if (data.type === 'ready') {
                        context.logger.info('✅ Worker ready');
                        return;
                    }
                    // 結果を処理
                    clearTimeout(timeout);
                    worker.terminate();
                    const response = data;
                    if (response.error) {
                        context.logger.error(`🔴 Worker returned error for ${filePath}:`, response.error);
                        reject(new Error(response.error));
                    }
                    else {
                        context.logger.info(`✅ Worker success for ${filePath}`);
                        resolve(response);
                    }
                };
                worker.onerror = (error) => {
                    clearTimeout(timeout);
                    worker.terminate();
                    const errorMsg = `Worker error for ${filePath}: ${error.message || 'Unknown error'}`;
                    context.logger.error(`🔴 ${errorMsg}`, error);
                    reject(new Error(errorMsg));
                };
                // normalizeCjsEsmとextractDependenciesの関数全体を文字列として取得
                const normalizeCjsEsmCode = normalizeCjsEsm.toString();
                const extractDependenciesCode = extractDependencies.toString();
                // デバッグ: 関数コードが正しく取得できているか確認
                context.logger.info(`📝 normalizeCjsEsm code length: ${normalizeCjsEsmCode.length}`);
                context.logger.info(`📝 extractDependencies code length: ${extractDependenciesCode.length}`);
                if (!normalizeCjsEsmCode || normalizeCjsEsmCode.length < 10) {
                    reject(new Error('normalizeCjsEsm function code extraction failed'));
                    worker.terminate();
                    return;
                }
                if (!extractDependenciesCode || extractDependenciesCode.length < 10) {
                    reject(new Error('extractDependencies function code extraction failed'));
                    worker.terminate();
                    return;
                }
                // リクエスト送信
                worker.postMessage({
                    id,
                    code,
                    filePath,
                    isTypeScript,
                    isJSX,
                    normalizeCjsEsm: normalizeCjsEsmCode,
                    extractDependencies: extractDependenciesCode,
                });
            }
            catch (error) {
                const errorMsg = `transpileWithWorker caught error: ${error instanceof Error ? error.message : String(error)}`;
                context.logger.error(`🔴 ${errorMsg}`, error);
                reject(new Error(errorMsg));
            }
        });
    }
    const runtimeFeatures = {
        /**
         * TypeScriptトランスパイラ（Web Worker使用）
         */
        transpiler: async (code, options = {}) => {
            const { filePath = 'unknown.ts', isTypeScript } = options;
            context.logger.info(`🔄 Transpiling: ${filePath}`);
            try {
                // TypeScriptの場合: Web Workerでトランスパイル
                if (isTypeScript) {
                    const result = await transpileWithWorker(code, filePath, true, false);
                    context.logger.info(`✅ Transpiled: ${filePath} (${code.length} -> ${result.code.length} bytes, ${result.dependencies.length} deps)`);
                    return {
                        code: result.code,
                        map: result.map,
                        dependencies: result.dependencies,
                    };
                }
                // 普通のJSの場合: normalizeCjsEsmのみ（渡されたものを使用）
                else {
                    const finalCode = normalizeCjsEsm(code);
                    const dependencies = extractDependencies(finalCode);
                    context.logger.info(`✅ Normalized: ${filePath} (${code.length} -> ${finalCode.length} bytes, ${dependencies.length} deps)`);
                    return {
                        code: finalCode,
                        dependencies,
                    };
                }
            }
            catch (error) {
                // エラーの詳細情報を取得
                const errorMessage = error instanceof Error ? error.message : String(error);
                const errorStack = error instanceof Error ? error.stack : undefined;
                context.logger.error(`❌ Transpile failed for ${filePath}:`, {
                    message: errorMessage,
                    stack: errorStack,
                    error: error,
                });
                // エラーを再スローして上位でキャッチできるようにする
                throw new Error(`Transpile failed for ${filePath}: ${errorMessage}`);
            }
        },
        /**
         * ファイル拡張子のサポート情報
         */
        supportedExtensions: ['.ts', '.mts', '.cts'],
        /**
         * トランスパイルが必要か判定
         */
        needsTranspile: (filePath) => {
            return /\.(ts|mts|cts)$/.test(filePath);
        },
    };
    // RuntimeRegistryに登録
    await context.registerTranspiler?.({
        id: 'typescript',
        supportedExtensions: runtimeFeatures.supportedExtensions,
        needsTranspile: runtimeFeatures.needsTranspile,
        transpile: runtimeFeatures.transpiler,
    });
    context.logger.info('✅ TypeScript transpiler registered with RuntimeRegistry');
    context.logger.info('✅ TypeScript Runtime Extension activated');
    return {
        runtimeFeatures,
    };
}
/**
 * 拡張機能のデアクティベーション
 */
export async function deactivate() {
    console.log('[TypeScript Runtime] Deactivating...');
}
