import onetype from '@onetype/framework';

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
		description: 'What needs to be done, written in markdown.'
	},
	status: {
		type: 'string',
		value: 'Backlog',
		description: 'Column status the task currently sits in.'
	},
	author: {
		type: 'object',
		value: null,
		config: 'work.person',
		description: 'Who created the task.'
	},
	assignee: {
		type: 'object',
		value: null,
		config: 'work.person',
		description: 'Who the task is assigned to. Null while unassigned.'
	},
	locked_at: {
		type: 'string',
		description: 'When the assignee took the lock. Null while the task is free.'
	},
	working_since: {
		type: 'string',
		description: 'When the current working session started. Null while nobody works.'
	},
	worked: {
		type: 'number',
		value: 0,
		description: 'Seconds of work accumulated over released sessions.'
	},
	priority: {
		type: 'string',
		value: 'Normal',
		options: ['Low', 'Normal', 'High', 'Urgent'],
		description: 'How urgent the task is.'
	},
	schedule_start: {
		type: 'string',
		description: 'When the task starts. Null starts on take.'
	},
	schedule_end: {
		type: 'string',
		description: 'When the task is due. Null means no deadline.'
	},
	questions: {
		type: 'array',
		value: [],
		each: {
			type: 'object',
			config: 'work.question',
			description: 'A single question on the task.'
		},
		description: 'Questions asked on the task, oldest first.'
	},
	comments: {
		type: 'array',
		value: [],
		each: {
			type: 'object',
			config: 'work.comment',
			description: 'A single comment on the task.'
		},
		description: 'Comments on the task, oldest first.'
	},
	created_at: {
		type: 'string',
		description: 'Timestamp of when the task was created.'
	}
});
