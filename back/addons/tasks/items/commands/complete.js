import commands from '@onetype/framework/commands';
import work from '#work/addon.js';

commands.Item({
	id: 'work:tasks:complete',
	exposed: true,
	method: 'POST',
	endpoint: '/api/work/tasks/:id/complete',
	description: 'Completes a task — moves it to the final column of its board and closes any running work session.',
	metadata: { addon: 'work.tasks' },
	condition: function()
	{
		if(this.http && !this.http.state.user)
		{
			return 'Sign in to manage tasks.';
		}
	},
	in: {
		id: {
			type: 'string',
			required: true,
			description: 'Id of the task to complete.'
		}
	},
	out: 'work.task',
	callback: async function(properties, resolve)
	{
		const item = await work.tasks.Fn('get', properties.id);

		if(!item)
		{
			return resolve(null, 'Task ' + properties.id + ' does not exist.', 404);
		}

		const board = work.boards.Fn('get', item.Get('board'));
		const columns = board ? board.Get('columns') || [] : [];
		const final = columns.find((column) => column.isFinal);
		const status = final ? final.value : 'Done';

		if(item.Get('status') === status)
		{
			return resolve(await work.tasks.Fn('serialize', item), 'Task is already in ' + status + '.');
		}

		const from = item.Get('status');

		/* Close the running work session into the counter. */
		if(item.Get('working_since'))
		{
			const seconds = Math.max(0, Math.round((Date.now() - new Date(item.Get('working_since')).getTime()) / 1000));

			item.Set('worked', (item.Get('worked') || 0) + seconds);
			item.Set('working_since', null);
		}

		item.Set('locked_at', null);
		item.Set('status', status);
		item.Set('updated_at', new Date().toISOString());

		await item.Update();

		const task = await work.tasks.Fn('serialize', item);

		onetype.Emit('work.tasks.complete', { task, from });

		resolve(task, 'Task ' + task.title + ' is complete.');
	}
});
