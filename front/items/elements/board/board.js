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
			this.columns = [
				{ value: 'Backlog', label: 'Backlog', color: 'brand' },
				{ value: 'Planned', label: 'Planned', color: 'blue' },
				{ value: 'Working', label: 'Working', color: 'orange' },
				{ value: 'Review', label: 'Review', color: 'red' },
				{ value: 'Done', label: 'Done', color: 'green' }
			];

			this.items = [];

			this.open = () => ({ value }) =>
			{
				return value;
			};

			return /* html */ `
				<e-views-board :field="'status'" :columns="columns" :items="items" :background="2" :_open="open()"></e-views-board>
			`;
		}
	});
});
