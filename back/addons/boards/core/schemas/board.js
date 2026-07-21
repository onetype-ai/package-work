onetype.SchemasRegister('work.board', {
	slug: {
		type: 'string',
		description: 'Unique board slug everything references.'
	},
	name: {
		type: 'string',
		description: 'Human readable name shown above the board.'
	},
	icon: {
		type: 'string',
		description: 'Material symbol shown next to the board name.'
	},
	description: {
		type: 'string',
		description: 'One line about what kind of work lives on this board.'
	},
	columns: {
		type: 'array',
		each: {
			type: 'object',
			config: 'work.column',
			description: 'A single column of the board.'
		},
		description: 'Columns of the board left to right, each collecting tasks of one status.'
	},
	order: {
		type: 'number',
		description: 'Position of the board among the others, lower comes first.'
	},
	isSystem: {
		type: 'boolean',
		description: 'True when the board is declared by a package and cannot be changed or removed.'
	}
});
