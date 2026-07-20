import commands from '@onetype/framework/commands';
import work from '#work/addon.js';

commands.Item({
	id: 'work:tasks:many',
	exposed: true,
	method: 'GET',
	endpoint: '/api/work/tasks',
	description: 'Lists tasks, optionally narrowed to one board, status or assignee. Trails stay out; open question counts ride along.',
	metadata: { addon: 'work.tasks' },
	condition: function()
	{
		if(this.http && !this.http.state.user)
		{
			return 'Sign in to see tasks.';
		}
	},
	in: {
		board: {
			type: 'string',
			description: 'Board slug to filter by. Empty lists every board.'
		},
		status: {
			type: 'string',
			description: 'Column status to filter by.'
		},
		assignee_user: {
			type: 'string',
			description: 'User id whose tasks to list.'
		},
		assignee_agent: {
			type: 'string',
			description: 'Agent slug whose tasks to list.'
		}
	},
	out: {
		tasks: {
			type: 'array',
			each: {
				type: 'object',
				config: 'work.task'
			},
			description: 'The matching tasks, newest first.'
		}
	},
	callback: async function(properties, resolve)
	{
		const find = work.tasks.Find().filter('deleted_at', null, 'NULL').sort('id', 'desc');

		properties.board && find.filter('board', properties.board);
		properties.status && find.filter('status', properties.status);
		properties.assignee_user && find.filter('assignee_user_id', properties.assignee_user);
		properties.assignee_agent && find.filter('assignee_agent', properties.assignee_agent);

		const rows = await find.many();
		const tasks = [];

		for(const row of rows)
		{
			tasks.push(await work.tasks.Fn('serialize', row));
		}

		/* Open question counts in one sweep — the board shows a badge,
		   not the trail. */
		const open = await work.tasks.questions.Find()
			.filter('deleted_at', null, 'NULL')
			.filter('answer', null, 'NULL')
			.many();

		const counts = {};

		for(const question of open)
		{
			counts[question.Get('task_id')] = (counts[question.Get('task_id')] || 0) + 1;
		}

		for(const task of tasks)
		{
			task.questionsOpen = counts[task.id] || 0;
		}

		resolve({ tasks });
	}
});
