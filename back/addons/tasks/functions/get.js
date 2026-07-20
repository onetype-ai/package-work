import work from '#work/addon.js';

work.tasks.Fn('get', async function(id)
{
	if(!id)
	{
		return null;
	}

	return await this.Find()
		.filter('id', id)
		.filter('deleted_at', null, 'NULL')
		.one();
});
