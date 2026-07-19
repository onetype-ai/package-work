commands.Item({
	id: 'work:boards:many',
	description: 'Lists every board of the instance, package declared and user created alike.',
	metadata: { addon: 'work.boards' },
	out: {
		boards: {
			type: 'array',
			each: {
				type: 'object',
				config: 'work.board'
			},
			description: 'The boards, ordered by position and name.'
		}
	},
	callback: async function(properties, resolve)
	{
		const boards = await work.boards.Fn('sync');

		resolve({ boards });
	}
});
