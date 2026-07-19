onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'work-board',
		icon: 'view_kanban',
		name: 'Work board',
		description: 'The kanban surface of one work board: task columns by status, rendered through the board view.',
		category: 'Work',
		collection: 'Work',
		author: 'OneType',
		config: {
			board: {
				type: 'string',
				value: 'general',
				description: 'Slug of the board to load.'
			}
		},
		render: function()
		{
			this.columns = () =>
			{
				const item = Object.values(work.boards.Items()).find((entry) => entry.Get('slug') === this.board);

				return item ? item.Get('columns') : [];
			};

			this.items = [
				{ id: 1, title: 'Design the task schema', description: 'Fields, statuses and the assignee model for work.tasks.', status: 'Done', author: { name: 'Dejan Tomić' }, assignee: { type: 'user', name: 'Dejan Tomić' }, date: 'Jul 15' },
				{ id: 2, title: 'Wire the boards registry', description: 'Package boards and stored boards living in one registry.', status: 'Done', author: { name: 'Orah' }, assignee: { type: 'agent', name: 'Orah' }, date: 'Jul 16' },
				{ id: 3, priority: 'Urgent', title: 'Kanban drag and drop', description: 'Cards move between columns and persist the new status.', status: 'Working', author: { name: 'Dejan Tomić' }, assignee: { type: 'agent', name: 'Orah' }, working: true, questions: 1, date: 'Jul 18' },
				{ id: 4, priority: 'High', title: 'Task detail drawer', description: 'Open a card into a full task view with the activity trail.', status: 'Planned', author: { name: 'Ana Ilić' }, date: 'Jul 19' },
				{ id: 5, title: 'Agents pick up tasks', description: 'A planned task with an agent assignee enters the run queue.', status: 'Planned', author: { name: 'Orah' }, assignee: { type: 'agent', name: 'Forge' }, questions: 1, date: 'Jul 20' },
				{ id: 6, title: 'Board switcher', description: 'Tabs over the registry so every package board is one click away.', status: 'Review', author: { name: 'Stefan Pakić' }, assignee: { type: 'user', name: 'Stefan Pakić' }, date: 'Jul 17' },
				{ id: 7, priority: 'Low', title: 'Filters and search', description: 'Slice the board by assignee and find a card by title.', status: 'Backlog', author: { name: 'Mila Kovač' }, date: 'Jul 21' },
				{ id: 8, title: 'Task comments', description: 'Humans and agents leave notes on the trail of a task.', status: 'Backlog', author: { name: 'Ana Ilić' }, date: 'Jul 22' }
			];

			this.filters = {};

			this.filter = () => ({ value }) =>
			{
				this.filters = value;
			};

			this.matches = (item) =>
			{
				const query = this.filters.query ? this.filters.query.toLowerCase() : '';
				const priorities = Array.isArray(this.filters.priority) ? this.filters.priority : [];
				const assignees = Array.isArray(this.filters.assignee) ? this.filters.assignee : [];

				if(query && !(item.title.toLowerCase().includes(query) || (item.description ? item.description.toLowerCase().includes(query) : false)))
				{
					return false;
				}

				if(priorities.length && !priorities.includes(item.priority ? item.priority : 'Normal'))
				{
					return false;
				}

				if(assignees.length && !assignees.includes(item.assignee ? item.assignee.name : ''))
				{
					return false;
				}

				if(this.filters.working && !item.working)
				{
					return false;
				}

				if(this.filters.questions && !item.questions)
				{
					return false;
				}

				return true;
			};

			this.filtered = () => this.items.filter((item) => this.matches(item));

			this.groups = () =>
			{
				const tally = (pick) => this.items.reduce((sums, item) =>
				{
					const key = pick(item);

					if(key)
					{
						sums[key] = (sums[key] ? sums[key] : 0) + 1;
					}

					return sums;
				}, {});

				const priorities = tally((item) => item.priority ? item.priority : 'Normal');
				const people = tally((item) => item.assignee && item.assignee.type === 'user' ? item.assignee.name : null);
				const agents = tally((item) => item.assignee && item.assignee.type === 'agent' ? item.assignee.name : null);

				return [
					{ id: 'query', type: 'search', placeholder: 'Search tasks...' },
					{ id: 'priority', label: 'Priority', type: 'options', options: ['Urgent', 'High', 'Normal', 'Low'].filter((level) => priorities[level]).map((level) => ({ value: level, label: level, count: priorities[level] })) },
					{ id: 'assignee', label: 'People', type: 'options', options: Object.keys(people).map((name) => ({ value: name, label: name, count: people[name] })) },
					{ id: 'assignee', label: 'Agents', type: 'options', options: Object.keys(agents).map((name) => ({ value: name, label: name, count: agents[name] })) },
					{ id: 'working', label: 'Working right now', type: 'toggle' },
					{ id: 'questions', label: 'With open questions', type: 'toggle' }
				];
			};

			this.badge = { 'Low': { color: 'blue', icon: 'stat_minus_1' }, 'High': { color: 'orange', icon: 'stat_1' }, 'Urgent': { color: 'red', icon: 'local_fire_department' } };

			this.cards = () => this.filtered().map((item) => ({
				...item,
				badges: item.priority && this.badge[item.priority] ? [{ label: item.priority, icon: this.badge[item.priority].icon, color: this.badge[item.priority].color }] : []
			}));

			this.open = () => ({ value }) =>
			{
				$ot.work.tasks.open(value);
			};

			this.create = () => async ({ value }) =>
			{
				const title = await $ot.float.confirm('Create a task in ' + value + '?', 'Give it a short, clear title.', { input: true, placeholder: 'Task title...', confirm: 'Create' });

				if(!title)
				{
					return;
				}

				this.items = [...this.items, {
					id: this.items.length + 1,
					title: title,
					description: '',
					status: value,
					author: { name: this.state.user && this.state.user.name ? this.state.user.name : 'You' },
					date: new Date().toLocaleDateString()
				}];
			};

			return /* html */ `
				<div ot-if="columns().length" class="split">
					<div class="side">
						<e-data-filters :groups="groups()" :background="1" :_change="filter()"></e-data-filters>
					</div>
					<div class="main">
						<e-views-board :field="'status'" :columns="columns()" :items="cards()" :background="2" :_open="open()" :_create="create()"></e-views-board>
					</div>
				</div>
				<e-status-error ot-if="!columns().length" icon="view_kanban" title="Board is not configured" :description="'Board ' + board + ' has no columns declared, so there is nothing to draw. Give it columns to bring it to life.'" :background="0"></e-status-error>
			`;
		}
	});
});
