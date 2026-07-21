onetype.SchemasRegister('work.question', {
	id: {
		type: 'string|number',
		description: 'Unique question identifier.'
	},
	author: {
		type: 'object',
		value: null,
		config: 'work.person',
		description: 'Who asked the question.'
	},
	text: {
		type: 'string',
		required: true,
		description: 'The question blocking the work.'
	},
	answer: {
		type: 'string',
		description: 'The answer once given. Empty while open.'
	},
	answered_by: {
		type: 'object',
		value: null,
		config: 'work.person',
		description: 'Who answered the question.'
	},
	answered_at: {
		type: 'string',
		description: 'When the answer was given.'
	},
	created_at: {
		type: 'string',
		description: 'When the question was asked.'
	}
});
