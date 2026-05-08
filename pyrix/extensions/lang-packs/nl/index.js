export async function activate(context) {
    context.logger.info('Language Pack activated');
    return {
        services: {
            'language-pack': {
                locale: 'nl',
                name: 'Nederlands',
                nativeName: 'Nederlands',
            },
        },
    };
}
export async function deactivate() { }
