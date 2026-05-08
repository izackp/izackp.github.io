/**
 * Test Multi-File Extension Entry Point
 * このエントリーファイルは他のモジュールをimportして使用する
 */
const React = window.__PYXIS_REACT__; const {useState} = React;
import { helperFunction, HelperClass, helperConstant } from './helper';
import utils from './utils';
import { add, multiply } from './utils';
/**
 * テストパネルコンポーネント
 */
function TestMultiFilePanel() {
    const [testResults, setTestResults] = useState(null);
    const runTests = () => {
        console.log('[test-multi-file] Running tests...');
        // helper.tsの関数を使用
        const helperResult = helperFunction();
        console.log('[test-multi-file] Helper function result:', helperResult);
        // helper.tsのクラスを使用
        const helperInstance = new HelperClass('Test message');
        const helperMessage = helperInstance.getMessage();
        console.log('[test-multi-file] Helper class result:', helperMessage);
        // helper.tsの定数を使用
        console.log('[test-multi-file] Helper constant:', helperConstant);
        // utils.tsのdefault exportを使用
        console.log('[test-multi-file] Utils version:', utils.version);
        // utils.tsの名前付きexportを使用
        const sum = add(5, 3);
        const product = multiply(5, 3);
        console.log('[test-multi-file] Math results:', { sum, product });
        // utils経由でも使用
        const sum2 = utils.add(10, 20);
        console.log('[test-multi-file] Utils.add result:', sum2);
        const results = {
            helperResult,
            helperMessage,
            helperConstant,
            utilsVersion: utils.version,
            mathResults: { sum, product, sum2 },
            timestamp: new Date().toISOString()
        };
        setTestResults(results);
        console.log('[test-multi-file] All tests completed:', results);
    };
    return (React.createElement("div", { style: {
            padding: '16px',
            height: '100%',
            overflow: 'auto',
            backgroundColor: 'var(--vscode-editor-background)',
            color: 'var(--vscode-editor-foreground)'
        } },
        React.createElement("h2", { style: { marginTop: 0 } }, "Multi-File Extension Test"),
        React.createElement("p", null, "\u3053\u306E\u30D1\u30CD\u30EB\u306F\u8907\u6570\u30D5\u30A1\u30A4\u30EB\u306B\u6E21\u308B\u62E1\u5F35\u6A5F\u80FD\u306E\u30C6\u30B9\u30C8\u3067\u3059\u3002"),
        React.createElement("p", null, "\u30A8\u30F3\u30C8\u30EA\u30FC\u30D5\u30A1\u30A4\u30EB(index.tsx)\u304C\u4ED6\u306E\u30E2\u30B8\u30E5\u30FC\u30EB(helper.ts, utils.ts)\u3092import\u3057\u3066\u4F7F\u7528\u3057\u3066\u3044\u307E\u3059\u3002"),
        React.createElement("button", { onClick: runTests, style: {
                padding: '8px 16px',
                marginTop: '16px',
                backgroundColor: 'var(--vscode-button-background)',
                color: 'var(--vscode-button-foreground)',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
                fontSize: '14px'
            } }, "\u30C6\u30B9\u30C8\u3092\u5B9F\u884C"),
        testResults && (React.createElement("div", { style: {
                marginTop: '16px',
                padding: '12px',
                backgroundColor: 'var(--vscode-textBlockQuote-background)',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px'
            } },
            React.createElement("h3", { style: { marginTop: 0 } }, "\u30C6\u30B9\u30C8\u7D50\u679C:"),
            React.createElement("div", null,
                "\u2705 Helper\u95A2\u6570: ",
                testResults.helperResult),
            React.createElement("div", null,
                "\u2705 Helper\u30AF\u30E9\u30B9: ",
                testResults.helperMessage),
            React.createElement("div", null,
                "\u2705 Helper\u5B9A\u6570: ",
                testResults.helperConstant),
            React.createElement("div", null,
                "\u2705 Utils\u30D0\u30FC\u30B8\u30E7\u30F3: ",
                testResults.utilsVersion),
            React.createElement("div", null,
                "\u2705 \u8DB3\u3057\u7B97 (5+3): ",
                testResults.mathResults.sum),
            React.createElement("div", null,
                "\u2705 \u639B\u3051\u7B97 (5*3): ",
                testResults.mathResults.product),
            React.createElement("div", null,
                "\u2705 Utils\u304B\u3089\u8DB3\u3057\u7B97 (10+20): ",
                testResults.mathResults.sum2),
            React.createElement("div", { style: { marginTop: '8px', opacity: 0.7 } },
                "\u5B9F\u884C\u6642\u523B: ",
                testResults.timestamp)))));
}
export function activate(context) {
    console.log('[test-multi-file] Activating extension...');
    console.log('[test-multi-file] Context:', context);
    // サイドバーパネルを登録
    context.sidebar.createPanel({
        id: 'test-multi-file-panel',
        title: 'Multi-File Test',
        icon: 'TestTube',
        component: TestMultiFilePanel,
    });
    context.sidebar.onPanelActivate('test-multi-file-panel', async (panelId) => {
        context.logger.info(`Multi-File Test panel activated: ${panelId}`);
    });
    context.logger.info('Multi-File Test sidebar panel registered');
    // UI拡張機能なので、services/commandsは不要
    // テスト用の関数は残しておくが、返却する必要はない
    return {};
}
export function deactivate() {
    console.log('[test-multi-file] Deactivating extension...');
}
