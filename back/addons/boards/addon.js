import onetype from '@onetype/framework';

onetype.AddonReady('work', (work) =>
{
	work.boards = onetype.Addon('work.boards', (addon) =>
	{
		addon.Table('work_boards');

		addon.Field('id', {
			type: 'string',
			description: 'Board id. The slug itself for boards declared by packages, the database row id for stored ones.'
		});

		addon.Field('slug', {
			type: 'string',
			required: true,
			description: 'Unique board slug everything references, like general or forge.'
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
			value: [
				{ value: 'Backlog', label: 'Backlog', color: 'brand', canCreate: true },
				{ value: 'Planned', label: 'Planned', color: 'blue', canCreate: true },
				{ value: 'Working', label: 'Working', color: 'orange', canCreate: true },
				{ value: 'Review', label: 'Review', color: 'red', canCreate: false },
				{ value: 'Done', label: 'Done', color: 'green', canCreate: false, isFinal: true }
			],
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

		addon.Field('updated_at', {
			type: 'string',
			description: 'Timestamp of the last change.'
		});

		addon.Field('created_at', {
			type: 'string',
			description: 'Timestamp of when the board was created.'
		});

		addon.Field('deleted_at', {
			type: 'string',
			description: 'Soft delete timestamp, null while active.'
		});

		addon.Schema('id bigserial primary key');
		addon.Schema('slug varchar(255) not null');
		addon.Schema('name varchar(255) not null');
		addon.Schema('icon varchar(255)');
		addon.Schema('description text');
		addon.Schema('columns jsonb');
		addon.Schema('updated_at timestamptz');
		addon.Schema('created_at timestamptz not null default now()');
		addon.Schema('deleted_at timestamptz');
		addon.Schema('unique (slug)');
	});
});
