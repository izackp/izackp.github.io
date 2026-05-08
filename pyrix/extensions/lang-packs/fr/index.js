export async function activate(context) {
    context.logger.info('Language Pack activated');
    return {
        services: {
            'language-pack': {
                locale: 'fr',
                name: 'Français',
                nativeName: 'Français',
            },
        },
    };
}
export async function deactivate() { }
