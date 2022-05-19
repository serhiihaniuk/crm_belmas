import log from 'npmlog';

const consoleLogStyles = 'background: #BF9270; color: #E60965; font-size: 14px;';

function info(message: string): void {
	console.log(`%c info: ${message}`, consoleLogStyles);
}

log.heading = '';

export default log;