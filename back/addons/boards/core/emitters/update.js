import onetype from '@onetype/framework';

onetype.EmitRegister('work.boards.update', {
	description: 'A board was updated.',
	metadata: { addon: 'work.boards' },
	config: {
		board: {
			type: 'object',
			config: 'work.board',
			description: 'The board after the change.'
		}
	}
});
