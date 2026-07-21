import commands from '@onetype/framework/commands';
import work from '#work/addon.js';

commands.Item({
	id: 'work:tasks:questions:create',
	exposed: true,
	method: 'POST',
	endpoint: '/api/work/tasks/:task/questions',
	description: 'Asks a question on a task — the way a worker flags that something blocks the work until someone answers.',
	metadata: { addon: 'work.tasks.questions' },
	condition: function()
	{
		if(this.http && !this.http.state.user)
		{
			return 'Sign in to ask questions.';
		}
	},
	in: {
		task: {
			type: 'string',
			required: true,
			description: 'Id of the task the question is about.'
		},
		text: {
			type: 'string',
			required: true,
			description: 'The question blocking the work.'
		}
	},
	out: 'work.question',
	callback: async function(properties, resolve)
	{
		const item = await work.tasks.Fn('get', properties.task);

		if(!item)
		{
			return resolve(null, 'Task ' + properties.task + ' does not exist.', 404);
		}

		const actor = work.tasks.Fn('actor', this);

		const row = work.tasks.questions.ItemAdd({
			task_id: item.Get('id'),
			user_id: actor.user_id,
			agent: actor.agent,
			text: properties.text,
			created_at: new Date().toISOString()
		}, null, true, false);

		await row.Create();

		const question = {
			id: String(row.Get('id')),
			author: await work.tasks.Fn('person', actor.user_id, actor.agent),
			text: row.Get('text'),
			answer: null,
			answered_by: null,
			answered_at: null,
			created_at: row.Get('created_at')
		};

		onetype.Emit('work.tasks.question', { task: String(item.Get('id')), question });

		resolve(question, 'Question asked on ' + item.Get('title') + '.');
	}
});
