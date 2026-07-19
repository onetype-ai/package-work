import { spawn } from 'node:child_process';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export async function browser(url, port, cookie)
{
	const profile = new URL('./.chrome-' + port, import.meta.url).pathname;
	const child = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + profile, '--no-first-run', 'about:blank'], { stdio: 'ignore' });

	for(let attempt = 0; attempt < 50; attempt++)
	{
		try
		{
			await fetch('http://localhost:' + port + '/json/version');
			break;
		}
		catch(error)
		{
			await new Promise((tick) => setTimeout(tick, 200));
		}
	}

	const target = await fetch('http://localhost:' + port + '/json/new?about:blank', { method: 'PUT' }).then((response) => response.json());
	const socket = new WebSocket(target.webSocketDebuggerUrl);
	const pending = new Map();
	const console_ = [];
	const errors = [];
	let sequence = 0;

	socket.addEventListener('message', (event) =>
	{
		const data = JSON.parse(event.data);

		if(data.id && pending.has(data.id))
		{
			pending.get(data.id)(data.result);
			pending.delete(data.id);
		}
		else if(data.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(data.params.type))
		{
			console_.push(data.params.args.map((argument) => argument.value !== undefined ? String(argument.value) : (argument.description || argument.type)).join(' '));
		}
		else if(data.method === 'Runtime.exceptionThrown')
		{
			errors.push(data.params.exceptionDetails.exception ? data.params.exceptionDetails.exception.description : data.params.exceptionDetails.text);
		}
	});

	const send = (method, parameters) => new Promise((settle) =>
	{
		const id = ++sequence;

		pending.set(id, settle);
		socket.send(JSON.stringify({ id, method, params: parameters || {} }));
	});

	await new Promise((open) => socket.addEventListener('open', open));
	await send('Runtime.enable');
	await send('Page.enable');
	await send('Network.enable');

	if(cookie)
	{
		await send('Network.setCookie', { name: 'ot_session', value: cookie, url: new URL(url).origin });
	}

	await send('Page.navigate', { url });

	return {
		console: console_,
		errors,
		async evaluate(expression)
		{
			const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });

			return result && result.result ? result.result.value : undefined;
		},
		async close()
		{
			try { socket.close(); } catch(error) {}
			child.kill();
		}
	};
}
