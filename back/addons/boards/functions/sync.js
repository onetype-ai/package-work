import work from '#work/addon.js';

work.boards.Fn('sync', async function()
{
	const seen = {};

	for(const [key, item] of Object.entries(this.Items()))
	{
		const slug = item.Get('slug');

		if(seen[slug])
		{
			this.ItemRemove(key, false);
		}
		else
		{
			seen[slug] = item;
		}
	}

	const rows = await this.Find()
		.filter('deleted_at', null, 'NULL')
		.many();

	for(const row of rows)
	{
		const item = seen[row.Get('slug')];

		if(!item)
		{
			this.Item({
				id: row.Get('id'),
				slug: row.Get('slug'),
				name: row.Get('name'),
				icon: row.Get('icon'),
				description: row.Get('description')
			});
		}
	}
});
