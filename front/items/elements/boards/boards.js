onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'work-boards',
		icon: 'tab',
		name: 'Boards',
		description: 'Board switcher: every board of the registry as a tab, with a create action for new ones.',
		category: 'Work',
		collection: 'Work',
		author: 'OneType',
		config: {
			active: {
				type: 'string',
				value: 'general',
				description: 'Slug of the selected board.'
			},
			_change: {
				type: 'function',
				description: 'Called with { value } holding the slug when a board is picked or created.'
			}
		},
		render: function()
		{
			this.boards = () => Object.values(work.boards.Items())
				.map((item) => ({ id: item.Get('slug'), label: item.Get('name'), icon: item.Get('icon'), order: item.Get('order') }))
				.sort((first, second) => first.order - second.order || first.label.localeCompare(second.label));

			this.pick = () => ({ value }) =>
			{
				if(this._change)
				{
					this._change({ value });
				}
			};

			this.add = async () =>
			{
				const name = await $ot.float.confirm('Create a board?', 'Give it a short, clear name.', { input: true, placeholder: 'Board name...', confirm: 'Create' });

				if(!name)
				{
					return;
				}

				const { data, code } = await $ot.command('work:boards:create', { name });

				if(code !== 200)
				{
					return;
				}

				await work.boards.Fn('sync');

				if(this._change)
				{
					this._change({ value: data.slug });
				}
			};

			return /* html */ `
				<div class="box">
					<e-navigation-tabs :items="boards()" :active="active" tone="contained" :background="1" :_change="pick()"></e-navigation-tabs>
					<e-form-button text="" icon="add" color="brand" tone="ghost" :ot-tooltip="'Create a board'" :_click="() => add()"></e-form-button>
				</div>
			`;
		}
	});
});
