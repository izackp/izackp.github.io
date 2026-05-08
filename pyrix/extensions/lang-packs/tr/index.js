export async function activate(context) {
    context.logger.info('Language Pack activated');
    return {
        services: {
            'language-pack': {
                locale: 'tr',
                name: 'Türkçe',
                nativeName: 'Türkçe',
            },
        },
    };
}
export async function deactivate() { }
