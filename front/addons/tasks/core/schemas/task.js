onetype.DataSchema('work.task', {
	id: {
		type: 'string|number',
		description: 'Unique task identifier.'
	},
	board: {
		type: 'string',
		value: 'general',
		description: 'Slug of the board the task lives on.'
	},
	title: {
		type: 'string',
		required: true,
		description: 'Short task title.'
	},
	description: {
		type: 'string',
		description: 'What needs to be done, in full.'
	},
	status: {
		type: 'string',
		value: 'Backlog',
		description: 'Column status the task currently sits in.'
	},
	author: {
		type: 'object',
		value: null,
		config: {
			name: {
				type: 'string',
				description: 'Display name of the author.'
			},
			type: {
				type: 'string',
				value: 'user',
				options: ['user', 'agent'],
				description: 'Whether the author is a person or an agent.'
			}
		},
		description: 'Who created the task.'
	},
	assignee: {
		type: 'object',
		value: null,
		config: {
			name: {
				type: 'string',
				description: 'Display name of the assignee.'
			},
			type: {
				type: 'string',
				value: 'user',
				options: ['user', 'agent'],
				description: 'Whether the assignee is a person or an agent.'
			}
		},
		description: 'Who the task is assigned to.'
	},
	created: {
		type: 'string',
		description: 'Human readable creation date.'
	},
	worked: {
		type: 'number',
		value: 0,
		description: 'Seconds of work accumulated over released sessions.'
	},
	locked: {
		type: 'object',
		value: null,
		config: {
			by: {
				type: 'string',
				description: 'Who holds the lock.'
			},
			at: {
				type: 'string',
				description: 'When the lock was taken.'
			}
		},
		description: 'Lock of the task while someone owns it. Null when free.'
	},
	working: {
		type: 'object',
		value: null,
		config: {
			by: {
				type: 'string',
				description: 'Who is working right now.'
			},
			since: {
				type: 'string',
				description: 'ISO timestamp the current session started at.'
			}
		},
		description: 'The live working session. Null while nobody works.'
	},
	question: {
		type: 'object',
		value: null,
		config: {
			by: {
				type: 'string',
				description: 'Who asked the question.'
			},
			text: {
				type: 'string',
				description: 'The question blocking the work.'
			},
			at: {
				type: 'string',
				description: 'When the question was asked.'
			},
			answer: {
				type: 'string',
				description: 'The answer once given. Empty while open.'
			}
		},
		description: 'An open question the task waits on. Null when there is none.'
	},
	comments: {
		type: 'array',
		value: [],
		each: {
			type: 'object',
			config: {
				by: {
					type: 'string',
					description: 'Who wrote the comment.'
				},
				at: {
					type: 'string',
					description: 'When the comment was written.'
				},
				text: {
					type: 'string',
					description: 'The comment itself.'
				}
			},
			description: 'A single comment on the task.'
		},
		description: 'Comments on the task, oldest first.'
	}
});
