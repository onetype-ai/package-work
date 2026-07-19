onetype.AddonReady('ui.screens', (screens) =>
{
	screens.Item({
		id: 'work',
		route: '/work',
		app: 'work',
		metadata: { addon: 'work' }
	});
});
