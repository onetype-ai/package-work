onetype.AddonReady('work.boards', (boards) =>
{
	boards.Fn('list', async function()
	{
		const { data, message, code } = await $ot.command('work:boards:many', {}, true);

		if(code !== 200)
		{
			throw onetype.Error(code, message);
		}

		this.ItemsRemove(false);
		this.ItemsAdd(data.boards);

		return data.boards;
	});
});
