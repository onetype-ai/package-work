import work from '#work/addon.js';

work.boards.Fn('list', function()
{
	const boards = Object.values(this.Items()).map((item) => ({
		slug: item.Get('slug'),
		name: item.Get('name'),
		icon: item.Get('icon'),
		description: item.Get('description'),
		order: item.Get('order'),
		isSystem: item.Get('id') === item.Get('slug')
	}));

	return boards.sort((first, second) => first.order - second.order || first.name.localeCompare(second.name));
});
