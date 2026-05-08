export async function activate(context) {
    context.logger.info('Language Pack activated');
    return {
        services: {
            'language-pack': {
                locale: 'pl',
                name: 'Polski',
                nativeName: 'Polski',
            },
        },
    };
}
export async function deactivate() { }
