import onetype from '@onetype/framework';
import commands from '@onetype/framework/commands';
import work from '#work/addon.js';

commands.Item({
	id: 'work:tasks:comments:create',
	exposed: true,
	method: 'POST',
	endpoint: '/api/work/tasks/:task/comments',
	description: 'Adds a comment to the trail of a task. The author is whoever runs the command.',
	metadata: { addon: 'work.tasks.comments' },
	condition: function()
	{
		if(this.http && !this.http.state.user)
		{
			return 'Sign in to comment.';
		}
	},
	in: {
		task: {
			type: 'string',
			required: true,
			description: 'Id of the task to comment on.'
		},
		text: {
			type: 'string',
			required: true,
			description: 'The comment itself.'
		}
	},
	out: 'work.comment',
	callback: async function(properties, resolve)
	{
		const item = await work.tasks.Fn('get', properties.task);

		if(!item)
		{
			return resolve(null, 'Task ' + properties.task + ' does not exist.', 404);
		}

		const actor = work.tasks.Fn('actor', this);

		const row = work.tasks.comments.ItemAdd({
			task_id: item.Get('id'),
			user_id: actor.user_id,
			agent: actor.agent,
			text: properties.text,
			created_at: new Date().toISOString()
		}, null, true, false);

		await row.Create();

		const comment = {
			id: String(row.Get('id')),
			author: await work.tasks.Fn('person', actor.user_id, actor.agent),
			text: row.Get('text'),
			created_at: row.Get('created_at')
		};

		onetype.Emit('work.tasks.comment', { task: String(item.Get('id')), comment });

		resolve(comment, 'Comment added to ' + item.Get('title') + '.');
	}
});
