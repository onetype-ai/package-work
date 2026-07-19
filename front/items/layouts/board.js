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
			return `<e-work-board board="general"></e-work-board>`;
		}
	});
});
