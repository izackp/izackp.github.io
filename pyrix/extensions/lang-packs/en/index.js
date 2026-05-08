export async function activate(context) {
    context.logger.info('English Language Pack activated');
    return {
        services: {
            'language-pack': {
                locale: 'en',
                name: 'English',
                nativeName: 'English',
            },
        },
    };
}
export async function deactivate() {
    console.log('[English Language Pack] Deactivating...');
}
