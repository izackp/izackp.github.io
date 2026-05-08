export async function activate(context) {
    context.logger.info('Language Pack activated');
    return {
        services: {
            'language-pack': {
                locale: 'hi',
                name: 'हिन्दी',
                nativeName: 'हिन्दी',
            },
        },
    };
}
export async function deactivate() { }
