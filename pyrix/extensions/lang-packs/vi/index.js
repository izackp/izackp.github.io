export async function activate(context) {
    context.logger.info('Language Pack activated');
    return {
        services: {
            'language-pack': {
                locale: 'vi',
                name: 'Tiếng Việt',
                nativeName: 'Tiếng Việt',
            },
        },
    };
}
export async function deactivate() { }
