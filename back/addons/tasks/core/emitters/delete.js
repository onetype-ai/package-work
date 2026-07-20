import onetype from '@onetype/framework';

onetype.EmitRegister('work.tasks.delete', {
	description: 'A task was deleted.',
	metadata: { addon: 'work.tasks' },
	config: {
		id: {
			type: 'string',
			description: 'Id of the deleted task.'
		}
	}
});
