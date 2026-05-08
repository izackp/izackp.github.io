export async function activate(context) {
    context.logger.info('Language Pack activated');
    return {
        services: {
            'language-pack': {
                locale: 'id',
                name: 'Bahasa Indonesia',
                nativeName: 'Bahasa Indonesia',
            },
        },
    };
}
export async function deactivate() { }
