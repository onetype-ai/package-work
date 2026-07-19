import onetype from '@onetype/framework';
import commands from '@onetype/framework/commands';
import work from '#work/addon.js';

commands.Item({
	id: 'work:boards:create',
	exposed: true,
	method: 'POST',
	endpoint: '/api/work/boards',
	description: 'Creates a board. The slug is derived from the name unless given explicitly.',
	metadata: { addon: 'work.boards' },
	condition: function()
	{
		if(this.http && !this.http.state.user)
		{
			return 'Sign in to manage boards.';
		}
	},
	in: {
		name: {
			type: 'string',
			required: true,
			description: 'Human readable name shown above the board.'
		},
		slug: {
			type: 'string',
			description: 'Unique board slug. Derived from the name when omitted.'
		},
		icon: {
			type: 'string',
			value: 'view_kanban',
			description: 'Material symbol shown next to the board name.'
		},
		description: {
			type: 'string',
			description: 'One line about what kind of work lives on this board.'
		}
	},
	out: 'work.board',
	callback: async function(properties, resolve)
	{
		const slug = properties.slug ? properties.slug : onetype.StringSlugify(properties.name);

		if(work.boards.Fn('get', slug))
		{
			return resolve(null, 'Board ' + slug + ' already exists.', 400);
		}

		const item = work.boards.ItemAdd({
			slug: slug,
			name: properties.name,
			icon: properties.icon,
			description: properties.description
		}, null, true, false);

		await item.Create();

		await work.boards.Fn('sync');

		const board = {
			slug: item.Get('slug'),
			name: item.Get('name'),
			icon: item.Get('icon'),
			description: item.Get('description'),
			order: item.Get('order'),
			isSystem: false
		};

		onetype.Emit('work.boards.create', { board });

		resolve(board, 'Board ' + board.name + ' was created.');
	}
});
