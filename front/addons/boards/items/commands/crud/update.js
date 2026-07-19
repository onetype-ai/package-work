commands.Item({
	id: 'work:boards:update',
	description: 'Updates the name, icon or description of a user created board.',
	metadata: { addon: 'work.boards' },
	in: {
		slug: {
			type: 'string',
			required: true,
			description: 'Slug of the board to update.'
		},
		name: {
			type: 'string',
			description: 'New name for the board.'
		},
		icon: {
			type: 'string',
			description: 'New material symbol for the board.'
		},
		description: {
			type: 'string',
			description: 'New description for the board.'
		}
	},
	out: 'work.board',
	callback: async function(properties, resolve)
	{
		const { data, message, code } = await $ot.command('work:boards:update', properties, true);

		if(code !== 200)
		{
			$ot.float.toast({ message, type: 'error' });

			return resolve(null, message, code);
		}

		$ot.float.toast({ message, type: 'success' });

		resolve(data);
	}
});
