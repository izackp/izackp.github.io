export async function activate(context) {
    context.logger.info('Language Pack activated');
    return {
        services: {
            'language-pack': {
                locale: 'ko',
                name: '한국어',
                nativeName: '한국어',
            },
        },
    };
}
export async function deactivate() { }
