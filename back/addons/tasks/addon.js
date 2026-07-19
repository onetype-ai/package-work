import onetype from '@onetype/framework';

onetype.AddonReady('work', (work) =>
{
	work.tasks = onetype.Addon('work.tasks', (addon) =>
	{
		addon.Table('work_tasks');
		addon.Search(['title', 'description']);

		addon.Field('id', {
			type: 'string',
			description: 'Unique task identifier.'
		});

		addon.Field('board', {
			type: 'string',
			value: 'general',
			required: true,
			description: 'Slug of the board the task lives on.'
		});

		addon.Field('title', {
			type: 'string',
			required: true,
			description: 'Short task title.'
		});

		addon.Field('description', {
			type: 'string',
			description: 'What needs to be done, written in markdown.'
		});

		addon.Field('status', {
			type: 'string',
			value: 'Backlog',
			required: true,
			description: 'Column status the task currently sits in.'
		});

		addon.Field('author_user_id', {
			type: 'string',
			description: 'User id of the author when a person created the task.'
		});

		addon.Field('author_agent', {
			type: 'string',
			description: 'Agent slug of the author when an agent created the task.'
		});

		addon.Field('assignee_user_id', {
			type: 'string',
			description: 'User id of the assignee when a person owns the task.'
		});

		addon.Field('assignee_agent', {
			type: 'string',
			description: 'Agent slug of the assignee when an agent owns the task.'
		});

		addon.Field('locked_at', {
			type: 'string',
			description: 'When the assignee took the lock. Null while the task is free.'
		});

		addon.Field('working_since', {
			type: 'string',
			description: 'When the current working session started. Null while nobody works.'
		});

		addon.Field('worked', {
			type: 'number',
			value: 0,
			description: 'Seconds of work accumulated over released sessions.'
		});

		addon.Field('schedule_start', {
			type: 'string',
			description: 'When the task starts. Null starts on take.'
		});

		addon.Field('schedule_repeat', {
			type: 'string',
			value: 'none',
			options: ['none', 'hourly', 'daily', 'weekly'],
			description: 'How often the task repeats after its start.'
		});

		addon.Field('updated_at', {
			type: 'string',
			description: 'Timestamp of the last change.'
		});

		addon.Field('created_at', {
			type: 'string',
			description: 'Timestamp of when the task was created.'
		});

		addon.Field('deleted_at', {
			type: 'string',
			description: 'Soft delete timestamp, null while active.'
		});

		addon.Schema('id bigserial primary key');
		addon.Schema('board varchar(255) not null');
		addon.Schema('title varchar(255) not null');
		addon.Schema('description text');
		addon.Schema("status varchar(255) not null default 'Backlog'");
		addon.Schema('author_user_id bigint references users(id) on delete set null');
		addon.Schema('author_agent varchar(255)');
		addon.Schema('assignee_user_id bigint references users(id) on delete set null');
		addon.Schema('assignee_agent varchar(255)');
		addon.Schema('locked_at timestamptz');
		addon.Schema('working_since timestamptz');
		addon.Schema('worked bigint not null default 0');
		addon.Schema('schedule_start timestamptz');
		addon.Schema("schedule_repeat varchar(255) not null default 'none'");
		addon.Schema('updated_at timestamptz');
		addon.Schema('created_at timestamptz not null default now()');
		addon.Schema('deleted_at timestamptz');
		addon.Schema('index (board)');
		addon.Schema('index (status)');
		addon.Schema('index (assignee_user_id)');
		addon.Schema('index (assignee_agent)');
	});
});
