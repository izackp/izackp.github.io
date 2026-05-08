export async function activate(context) {
    context.logger.info('Language Pack activated');
    return {
        services: {
            'language-pack': {
                locale: 'es',
                name: 'Español',
                nativeName: 'Español',
            },
        },
    };
}
export async function deactivate() { }
