import onetype from '@onetype/framework';

onetype.EmitRegister('work.tasks.update', {
	description: 'Fields of a task changed.',
	metadata: { addon: 'work.tasks' },
	config: {
		task: {
			type: 'object',
			config: 'work.task',
			description: 'The task after the change.'
		}
	}
});
