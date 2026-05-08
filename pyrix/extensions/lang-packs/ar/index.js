export async function activate(context) {
    context.logger.info('Language Pack activated');
    return {
        services: {
            'language-pack': {
                locale: 'ar',
                name: 'العربية',
                nativeName: 'العربية',
            },
        },
    };
}
export async function deactivate() { }
