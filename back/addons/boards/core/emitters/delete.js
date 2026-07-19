import onetype from '@onetype/framework';

onetype.EmitRegister('work.boards.delete', {
	description: 'A board was deleted.',
	metadata: { addon: 'work.boards' },
	config: {
		board: {
			type: 'object',
			config: 'work.board',
			description: 'The deleted board.'
		}
	}
});
