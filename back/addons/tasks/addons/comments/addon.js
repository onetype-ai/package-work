import onetype from '@onetype/framework';

onetype.AddonReady('work.tasks', (tasks) =>
{
	tasks.comments = onetype.Addon('work.tasks.comments', (addon) =>
	{
		addon.Table('work_task_comments');

		addon.Field('id', {
			type: 'string',
			description: 'Unique comment identifier.'
		});

		addon.Field('task_id', {
			type: 'string',
			required: true,
			description: 'Id of the task the comment belongs to.'
		});

		addon.Field('user_id', {
			type: 'string',
			description: 'User id of the author when a person wrote the comment.'
		});

		addon.Field('agent', {
			type: 'string',
			description: 'Agent slug of the author when an agent wrote the comment.'
		});

		addon.Field('text', {
			type: 'string',
			required: true,
			description: 'The comment itself.'
		});

		addon.Field('updated_at', {
			type: 'string',
			description: 'Timestamp of the last change.'
		});

		addon.Field('created_at', {
			type: 'string',
			description: 'Timestamp of when the comment was written.'
		});

		addon.Field('deleted_at', {
			type: 'string',
			description: 'Soft delete timestamp, null while active.'
		});

		addon.Schema('id bigserial primary key');
		addon.Schema('task_id bigint references work_tasks(id) on delete cascade');
		addon.Schema('user_id bigint references users(id) on delete set null');
		addon.Schema('agent varchar(255)');
		addon.Schema('text text not null');
		addon.Schema('updated_at timestamptz');
		addon.Schema('created_at timestamptz not null default now()');
		addon.Schema('deleted_at timestamptz');
		addon.Schema('index (task_id)');
	});
});
