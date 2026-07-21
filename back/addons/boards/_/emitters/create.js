onetype.EmitRegister('work.boards.create', {
	description: 'A board was created.',
	metadata: { addon: 'work.boards' },
	config: {
		board: {
			type: 'object',
			config: 'work.board',
			description: 'The created board.'
		}
	}
});
