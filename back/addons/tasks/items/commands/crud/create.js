import onetype from '@onetype/framework';
import commands from '@onetype/framework/commands';
import work from '#work/addon.js';

commands.Item({
	id: 'work:tasks:create',
	exposed: true,
	method: 'POST',
	endpoint: '/api/work/tasks',
	description: 'Creates a task on a board. The author is whoever runs the command — a signed in user or an agent.',
	metadata: { addon: 'work.tasks' },
	condition: function()
	{
		if(this.http && !this.http.state.user)
		{
			return 'Sign in to manage tasks.';
		}
	},
	in: {
		board: {
			type: 'string',
			value: 'general',
			description: 'Slug of the board the task goes on.'
		},
		title: {
			type: 'string',
			required: true,
			description: 'Short task title.'
		},
		description: {
			type: 'string',
			description: 'What needs to be done, written in markdown.'
		},
		status: {
			type: 'string',
			description: 'Column to create the task in. Omitted takes the first column of the board.'
		},
		priority: {
			type: 'string',
			value: 'Normal',
			options: ['Low', 'Normal', 'High', 'Urgent'],
			description: 'How urgent the task is.'
		},
		assignee_user: {
			type: 'string',
			description: 'User id to assign the task to. Leave empty for unassigned.'
		},
		assignee_agent: {
			type: 'string',
			description: 'Agent slug to assign the task to. Leave empty for unassigned.'
		},
		schedule_start: {
			type: 'string',
			description: 'When the task starts, ISO timestamp. Null starts on take.'
		},
		schedule_end: {
			type: 'string',
			description: 'When the task is due, ISO timestamp. Null means no deadline.'
		}
	},
	out: 'work.task',
	callback: async function(properties, resolve)
	{
		const board = work.boards.Fn('get', properties.board);

		if(!board)
		{
			return resolve(null, 'Board ' + properties.board + ' does not exist.', 404);
		}

		const columns = board.Get('columns') || [];
		const status = properties.status || (columns[0] ? columns[0].value : 'Backlog');

		if(columns.length && !columns.some((column) => column.value === status))
		{
			return resolve(null, 'Board ' + properties.board + ' has no ' + status + ' column.', 400);
		}

		if(properties.assignee_user && properties.assignee_agent)
		{
			return resolve(null, 'A task is assigned to a user or an agent, not both.', 400);
		}

		const actor = work.tasks.Fn('actor', this);

		const item = work.tasks.ItemAdd({
			board: properties.board,
			title: properties.title,
			description: properties.description || null,
			status: status,
			author_user_id: actor.user_id,
			author_agent: actor.agent,
			assignee_user_id: properties.assignee_user || null,
			assignee_agent: properties.assignee_agent || null,
			priority: properties.priority,
			schedule_start: properties.schedule_start || null,
			schedule_end: properties.schedule_end || null,
			created_at: new Date().toISOString()
		}, null, true, false);

		await item.Create();

		const task = await work.tasks.Fn('serialize', item);

		onetype.Emit('work.tasks.create', { task });

		resolve(task, 'Task ' + task.title + ' was created on ' + task.board + '.');
	}
});
