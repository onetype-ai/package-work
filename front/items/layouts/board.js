onetype.AddonReady('ui.layouts', (layouts) =>
{
	layouts.Item({
		id: 'work-board',
		isActive: true,
		condition: { app: ['work'] },
		zone: 'root',
		slot: 'center',
		render: function()
		{
			this.board = 'general';

			this.pick = () => ({ value }) =>
			{
				this.board = value;
			};

			return /* html */ `
				<div class="ot-container-full ot-py-l ot-dots ot-fill ot-flex-vertical">
					<e-work-boards :active="board" :_change="pick()"></e-work-boards>
					<e-work-board :board="board"></e-work-board>
				</div>
			`;
		}
	});
});
