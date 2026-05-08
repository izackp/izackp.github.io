export async function activate(context) {
    context.logger.info('Language Pack activated');
    return {
        services: {
            'language-pack': {
                locale: 'it',
                name: 'Italiano',
                nativeName: 'Italiano',
            },
        },
    };
}
export async function deactivate() { }
