/**
 * TODO Panel Extension
 * Pyxis内のファイルから TODO: コメントを検索して一覧表示
 */
const React = window.__PYXIS_REACT__; const {useState, useEffect} = React;
// サイドバーパネルコンポーネント
function createTodoSidebarPanel(context) {
    return function TodoSidebarPanel({ extensionId, panelId, isActive, state }) {
        const [todos, setTodos] = useState([]);
        const [loading, setLoading] = useState(false);
        const [filter, setFilter] = useState('');
        // TODO検索関数
        const scanTodos = async () => {
            if (!context?.getSystemModule)
                return;
            setLoading(true);
            try {
                const fileRepository = await context.getSystemModule('fileRepository');
                // 全プロジェクトを取得
                const projects = await fileRepository.getProjects();
                const allTodos = [];
                for (const project of projects) {
                    // プロジェクト配下を効率的に走査（プレフィックス検索）
                    // root 配下全体をスキャンする場合は prefix = '/' を渡す
                    const files = await fileRepository.getFilesByPrefix(project.id, '/');
                    for (const file of files) {
                        if (file.type !== 'file' || file.isBufferArray)
                            continue;
                        // ファイル内容からTODOを検索
                        const lines = (file.content || '').split('\n');
                        lines.forEach((line, index) => {
                            const todoMatch = line.match(/(?:TODO|FIXME)\s*[:：]\s*(.+)/i);
                            if (todoMatch) {
                                allTodos.push({
                                    id: `${project.id}-${file.path}-${index}`,
                                    text: todoMatch[1].trim(),
                                    filePath: file.path,
                                    line: index + 1,
                                    projectId: project.id,
                                    projectName: project.name,
                                    file: file,
                                });
                            }
                        });
                    }
                }
                setTodos(allTodos);
            }
            catch (error) {
                console.error('Failed to scan TODOs:', error);
            }
            finally {
                setLoading(false);
            }
        };
        // 初回ロード
        useEffect(() => {
            if (isActive) {
                scanTodos();
            }
        }, [isActive]);
        // TODOをクリックしたときにファイルを開く
        const handleTodoClick = (todo) => {
            if (!context?.tabs.openSystemTab) {
                context.logger.error('openSystemTab is not available');
                return;
            }
            try {
                // システムのopenTabを使ってファイルを開く
                context.tabs.openSystemTab(todo.file, {
                    kind: 'editor',
                    jumpToLine: todo.line,
                    activateAfterOpen: true,
                });
                context.logger.info(`Opened file: ${todo.filePath} at line ${todo.line}`);
            }
            catch (error) {
                context.logger.error('Failed to open file:', error);
            }
        };
        // フィルタリング
        const filteredTodos = todos.filter(todo => filter === '' ||
            todo.text.toLowerCase().includes(filter.toLowerCase()) ||
            todo.filePath.toLowerCase().includes(filter.toLowerCase()) ||
            todo.projectName.toLowerCase().includes(filter.toLowerCase()));
        return (React.createElement("div", { style: {
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                color: '#d4d4d4',
                overflow: 'hidden',
            } },
            React.createElement("div", { style: {
                    padding: '12px 16px',
                    borderBottom: '1px solid #333',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                } },
                React.createElement("div", null,
                    React.createElement("h3", { style: { margin: 0, fontSize: '14px', fontWeight: 'bold' } }, "\uD83D\uDCCB TODO"),
                    React.createElement("p", { style: { margin: '4px 0 0 0', fontSize: '11px', color: '#888' } }, loading ? '🔍 Scanning...' : `${todos.length} found • ${filteredTodos.length} shown`)),
                React.createElement("button", { onClick: scanTodos, disabled: loading, style: {
                        padding: '4px 8px',
                        background: loading ? '#555' : '#0e639c',
                        border: 'none',
                        borderRadius: '4px',
                        color: '#fff',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '11px',
                        fontWeight: 'bold',
                    } }, loading ? '...' : '🔄')),
            React.createElement("div", { style: {
                    padding: '12px 16px',
                    borderBottom: '1px solid #333',
                } },
                React.createElement("input", { type: "text", value: filter, onChange: (e) => setFilter(e.target.value), placeholder: "Filter...", style: {
                        width: '100%',
                        padding: '6px 10px',
                        background: '#2d2d2d',
                        border: '1px solid #444',
                        borderRadius: '4px',
                        color: '#d4d4d4',
                        fontSize: '12px',
                        outline: 'none',
                    } })),
            React.createElement("div", { style: {
                    flex: 1,
                    overflowY: 'auto',
                    padding: '8px',
                } }, loading ? (React.createElement("p", { style: { color: '#888', textAlign: 'center', marginTop: '32px', fontSize: '12px' } }, "\uD83D\uDD0D Scanning...")) : filteredTodos.length === 0 ? (React.createElement("div", { style: { textAlign: 'center', marginTop: '32px' } },
                React.createElement("p", { style: { color: '#888', fontSize: '12px' } }, filter ? '🔍 No matches' : '✅ No TODOs found'),
                !filter && todos.length === 0 && (React.createElement("p", { style: { color: '#666', fontSize: '11px', marginTop: '8px', padding: '0 12px' } }, "Add TODO: or FIXME: comments")))) : (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '6px' } }, filteredTodos.map(todo => (React.createElement("div", { key: todo.id, onClick: () => handleTodoClick(todo), style: {
                    padding: '10px',
                    background: '#2d2d2d',
                    borderRadius: '4px',
                    borderLeft: '3px solid #0e639c',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                }, onMouseEnter: (e) => {
                    e.currentTarget.style.background = '#3d3d3d';
                    e.currentTarget.style.borderLeftColor = '#1e7bbe';
                }, onMouseLeave: (e) => {
                    e.currentTarget.style.background = '#2d2d2d';
                    e.currentTarget.style.borderLeftColor = '#0e639c';
                } },
                React.createElement("div", { style: { fontSize: '12px', color: '#d4d4d4', marginBottom: '4px', fontWeight: '500' } }, todo.text),
                React.createElement("div", { style: { fontSize: '10px', color: '#888', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' } },
                    React.createElement("span", { style: { color: '#7cb342' } }, todo.projectName),
                    React.createElement("span", { style: { color: '#555' } }, "\u2022"),
                    React.createElement("span", { style: { fontFamily: 'monospace', color: '#64b5f6' } }, todo.filePath),
                    React.createElement("span", { style: { color: '#555' } }, "\u2022"),
                    React.createElement("span", { style: { fontFamily: 'monospace' } },
                        "L",
                        todo.line))))))))));
    };
}
/**
 * 拡張機能のactivate関数
 */
export async function activate(context) {
    context.logger.info('TODO Scanner Extension activated!');
    // サイドバーパネルを登録
    const TodoSidebarPanelWithContext = createTodoSidebarPanel(context);
    context.sidebar.createPanel({
        id: 'todo-scanner',
        title: 'TODO',
        icon: 'CheckSquare',
        component: TodoSidebarPanelWithContext,
    });
    context.sidebar.onPanelActivate('todo-scanner', async (panelId) => {
        context.logger.info(`TODO panel activated: ${panelId}`);
    });
    context.logger.info('TODO sidebar panel registered');
    // UI拡張機能なので、services/commandsは不要
    return {};
}
/**
 * 拡張機能のdeactivate関数
 */
export async function deactivate() {
    console.log('TODO Scanner Extension deactivated');
}
