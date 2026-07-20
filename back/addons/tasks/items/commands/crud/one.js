import commands from '@onetype/framework/commands';
import work from '#work/addon.js';

commands.Item({
	id: 'work:tasks:one',
	exposed: true,
	method: 'GET',
	endpoint: '/api/work/tasks/:id',
	description: 'Returns one task in full — fields, assignee, and the whole comment and question trail.',
	metadata: { addon: 'work.tasks' },
	condition: function()
	{
		if(this.http && !this.http.state.user)
		{
			return 'Sign in to see tasks.';
		}
	},
	in: {
		id: {
			type: 'string',
			required: true,
			description: 'Id of the task to fetch.'
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

		resolve(await work.tasks.Fn('serialize', item, { detail: true }));
	}
});
