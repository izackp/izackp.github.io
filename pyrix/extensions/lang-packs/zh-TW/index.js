export async function activate(context) {
    context.logger.info('Language Pack activated');
    return {
        services: {
            'language-pack': {
                locale: 'zh-TW',
                name: '繁體中文',
                nativeName: '繁體中文',
            },
        },
    };
}
export async function deactivate() { }
