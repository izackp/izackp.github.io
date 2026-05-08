export async function activate(context) {
    context.logger.info('Language Pack activated');
    return {
        services: {
            'language-pack': {
                locale: 'ru',
                name: 'Русский',
                nativeName: 'Русский',
            },
        },
    };
}
export async function deactivate() { }
