const consoleLogStyles = 'background: #BF9270; color: #E60965; font-size: 14px;';

function info(message) {
	console.log(`%c info: ${message}`, consoleLogStyles);
}

export default info;
