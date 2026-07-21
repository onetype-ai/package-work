import commands from '@onetype/framework/commands';
import work from '#work/addon.js';

commands.Item({
	id: 'work:tasks:update',
	exposed: true,
	method: 'PUT',
	endpoint: '/api/work/tasks/:id',
	description: 'Updates the title, description, priority or schedule of a task. Moving between columns goes through work:tasks:move.',
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
			description: 'Id of the task to update.'
		},
		title: {
			type: 'string',
			description: 'New title. Empty keeps the current one.'
		},
		description: {
			type: 'string',
			description: 'New description. Empty keeps the current one.'
		},
		priority: {
			type: 'string',
			options: ['Low', 'Normal', 'High', 'Urgent'],
			description: 'New priority. Empty keeps the current one.'
		},
		schedule_start: {
			type: 'string',
			description: 'New start, ISO timestamp. Empty keeps the current one.'
		},
		schedule_end: {
			type: 'string',
			description: 'New deadline, ISO timestamp. Empty keeps the current one.'
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

		properties.title && item.Set('title', properties.title);
		properties.description !== undefined && properties.description !== null && item.Set('description', properties.description);
		properties.priority && item.Set('priority', properties.priority);
		properties.schedule_start && item.Set('schedule_start', properties.schedule_start);
		properties.schedule_end && item.Set('schedule_end', properties.schedule_end);
		item.Set('updated_at', new Date().toISOString());

		await item.Update();

		const task = await work.tasks.Fn('serialize', item);

		onetype.Emit('work.tasks.update', { task });

		resolve(task, 'Task ' + task.title + ' was updated.');
	}
});
