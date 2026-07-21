onetype.AddonReady('work.tasks', (tasks) =>
{
	tasks.questions = onetype.Addon('work.tasks.questions', (addon) =>
	{
		addon.Table('work_task_questions');

		addon.Field('id', {
			type: 'string',
			description: 'Unique question identifier.'
		});

		addon.Field('task_id', {
			type: 'string',
			required: true,
			description: 'Id of the task the question belongs to.'
		});

		addon.Field('user_id', {
			type: 'string',
			description: 'User id of the asker when a person asked the question.'
		});

		addon.Field('agent', {
			type: 'string',
			description: 'Agent slug of the asker when an agent asked the question.'
		});

		addon.Field('text', {
			type: 'string',
			required: true,
			description: 'The question blocking the work.'
		});

		addon.Field('answer', {
			type: 'string',
			description: 'The answer once given. Null while open.'
		});

		addon.Field('answered_user_id', {
			type: 'string',
			description: 'User id of the answerer when a person answered.'
		});

		addon.Field('answered_agent', {
			type: 'string',
			description: 'Agent slug of the answerer when an agent answered.'
		});

		addon.Field('answered_at', {
			type: 'string',
			description: 'When the answer was given.'
		});

		addon.Field('updated_at', {
			type: 'string',
			description: 'Timestamp of the last change.'
		});

		addon.Field('created_at', {
			type: 'string',
			description: 'Timestamp of when the question was asked.'
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
		addon.Schema('answer text');
		addon.Schema('answered_user_id bigint references users(id) on delete set null');
		addon.Schema('answered_agent varchar(255)');
		addon.Schema('answered_at timestamptz');
		addon.Schema('updated_at timestamptz');
		addon.Schema('created_at timestamptz not null default now()');
		addon.Schema('deleted_at timestamptz');
		addon.Schema('index (task_id)');
	});
});
