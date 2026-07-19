commands.Item({
	id: 'work:boards:create',
	description: 'Creates a board. The slug is derived from the name unless given explicitly.',
	metadata: { addon: 'work.boards' },
	in: {
		name: {
			type: 'string',
			required: true,
			description: 'Human readable name shown above the board.'
		},
		slug: {
			type: 'string',
			description: 'Unique board slug. Derived from the name when omitted.'
		},
		icon: {
			type: 'string',
			value: 'view_kanban',
			description: 'Material symbol shown next to the board name.'
		},
		description: {
			type: 'string',
			description: 'One line about what kind of work lives on this board.'
		}
	},
	out: 'work.board',
	callback: async function(properties, resolve)
	{
		const { data, message, code } = await $ot.command('work:boards:create', properties, true);

		if(code !== 200)
		{
			$ot.float.toast({ message, type: 'error' });

			return resolve(null, message, code);
		}

		$ot.float.toast({ message, type: 'success' });

		resolve(data);
	}
});
