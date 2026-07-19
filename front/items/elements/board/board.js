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
				{ id: 1, title: 'Design the task schema', description: 'Fields, statuses and the assignee model for work.tasks.', status: 'Done', author: { name: 'Dejan Tomić' }, date: 'Jul 15' },
				{ id: 2, title: 'Wire the boards registry', description: 'Package boards and stored boards living in one registry.', status: 'Done', author: { name: 'Orah' }, date: 'Jul 16' },
				{ id: 3, title: 'Kanban drag and drop', description: 'Cards move between columns and persist the new status.', status: 'Working', author: { name: 'Dejan Tomić' }, date: 'Jul 18' },
				{ id: 4, title: 'Task detail drawer', description: 'Open a card into a full task view with the activity trail.', status: 'Planned', author: { name: 'Ana Ilić' }, date: 'Jul 19' },
				{ id: 5, title: 'Agents pick up tasks', description: 'A planned task with an agent assignee enters the run queue.', status: 'Planned', author: { name: 'Orah' }, date: 'Jul 20' },
				{ id: 6, title: 'Board switcher', description: 'Tabs over the registry so every package board is one click away.', status: 'Review', author: { name: 'Stefan Pakić' }, date: 'Jul 17' },
				{ id: 7, title: 'Filters and search', description: 'Slice the board by assignee and find a card by title.', status: 'Backlog', author: { name: 'Mila Kovač' }, date: 'Jul 21' },
				{ id: 8, title: 'Task comments', description: 'Humans and agents leave notes on the trail of a task.', status: 'Backlog', author: { name: 'Ana Ilić' }, date: 'Jul 22' }
			];

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
				<e-views-board ot-if="columns().length" :field="'status'" :columns="columns()" :items="items" :background="2" :_open="open()" :_create="create()"></e-views-board>
				<e-status-error ot-if="!columns().length" icon="view_kanban" title="Board is not configured" :description="'Board ' + board + ' has no columns declared, so there is nothing to draw. Give it columns to bring it to life.'" :background="0"></e-status-error>
			`;
		}
	});
});
