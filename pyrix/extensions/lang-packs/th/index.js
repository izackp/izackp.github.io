export async function activate(context) {
    context.logger.info('Language Pack activated');
    return {
        services: {
            'language-pack': {
                locale: 'th',
                name: 'ไทย',
                nativeName: 'ไทย',
            },
        },
    };
}
export async function deactivate() { }
