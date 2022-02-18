const consoleLogStyles = 'color: #E60965; font-size: 14px;'

function info(message: string | number | boolean ): void {
    console.log(`%c info: ${message}`, consoleLogStyles);
}

export default info;
