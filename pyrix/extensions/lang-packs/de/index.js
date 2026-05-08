export async function activate(context) {
    context.logger.info('Language Pack activated');
    return {
        services: {
            'language-pack': {
                locale: 'de',
                name: 'Deutsch',
                nativeName: 'Deutsch',
            },
        },
    };
}
export async function deactivate() { }
