export async function activate(context) {
    context.logger.info('Language Pack activated');
    return {
        services: {
            'language-pack': {
                locale: 'sv',
                name: 'Svenska',
                nativeName: 'Svenska',
            },
        },
    };
}
export async function deactivate() { }
