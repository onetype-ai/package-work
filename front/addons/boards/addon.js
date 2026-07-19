onetype.AddonReady('work', (work) =>
{
	work.boards = onetype.Addon('work.boards', (addon) =>
	{
		addon.Field('slug', {
			type: 'string',
			required: true,
			description: 'Unique board slug everything references.'
		});

		addon.Field('name', {
			type: 'string',
			required: true,
			description: 'Human readable name shown above the board.'
		});

		addon.Field('icon', {
			type: 'string',
			value: 'view_kanban',
			description: 'Material symbol shown next to the board name.'
		});

		addon.Field('description', {
			type: 'string',
			description: 'One line about what kind of work lives on this board.'
		});

		addon.Field('columns', {
			type: 'array',
			value: [],
			each: {
				type: 'object',
				config: 'work.column',
				description: 'A single column of the board.'
			},
			description: 'Columns of the board left to right, each collecting tasks of one status.'
		});

		addon.Field('order', {
			type: 'number',
			value: 100,
			description: 'Position of the board among the others, lower comes first.'
		});

		addon.Field('isSystem', {
			type: 'boolean',
			value: false,
			description: 'True when the board is declared by a package and cannot be changed or removed.'
		});
	});
});
