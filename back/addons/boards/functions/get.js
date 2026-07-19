import work from '#work/addon.js';

work.boards.Fn('get', function(slug)
{
	for(const item of Object.values(this.Items()))
	{
		if(item.Get('slug') === slug)
		{
			return item;
		}
	}

	return null;
});
