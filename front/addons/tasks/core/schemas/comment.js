onetype.SchemasRegister('work.comment', {
	id: {
		type: 'string|number',
		description: 'Unique comment identifier.'
	},
	author: {
		type: 'object',
		value: null,
		config: 'work.person',
		description: 'Who wrote the comment.'
	},
	text: {
		type: 'string',
		required: true,
		description: 'The comment itself.'
	},
	created_at: {
		type: 'string',
		description: 'When the comment was written.'
	}
});
