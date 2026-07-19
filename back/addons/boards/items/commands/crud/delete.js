import onetype from '@onetype/framework';
import commands from '@onetype/framework/commands';
import work from '#work/addon.js';

commands.Item({
	id: 'work:boards:delete',
	exposed: true,
	method: 'DELETE',
	endpoint: '/api/work/boards/:slug',
	description: 'Deletes a user created board. Boards declared by packages cannot be removed.',
	metadata: { addon: 'work.boards' },
	condition: function()
	{
		if(this.http && !this.http.state.user)
		{
			return 'Sign in to manage boards.';
		}
	},
	in: {
		slug: {
			type: 'string',
			required: true,
			description: 'Slug of the board to delete.'
		}
	},
	out: 'work.board',
	callback: async function(properties, resolve)
	{
		const item = work.boards.Fn('get', properties.slug);

		if(!item)
		{
			return resolve(null, 'Board ' + properties.slug + ' not found.', 404);
		}

		if(!item.Get('id'))
		{
			return resolve(null, 'Board ' + properties.slug + ' is declared by a package and cannot be removed.', 400);
		}

		item.Set('deleted_at', new Date().toISOString());

		await item.Update({ whitelist: ['deleted_at'] });

		const board = {
			slug: item.Get('slug'),
			name: item.Get('name'),
			icon: item.Get('icon'),
			description: item.Get('description'),
			order: item.Get('order'),
			isSystem: false
		};

		for(const [key, registered] of Object.entries(work.boards.Items()))
		{
			if(registered === item)
			{
				work.boards.ItemRemove(key, false);
			}
		}

		onetype.Emit('work.boards.delete', { board });

		resolve(board, 'Board ' + board.name + ' is deleted.');
	}
});
