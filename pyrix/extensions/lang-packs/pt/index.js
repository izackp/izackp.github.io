export async function activate(context) {
    context.logger.info('Language Pack activated');
    return {
        services: {
            'language-pack': {
                locale: 'pt',
                name: 'Português',
                nativeName: 'Português',
            },
        },
    };
}
export async function deactivate() { }
