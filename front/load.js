$ot.work = {
	boards: {
		list: () => work.boards.Fn('list'),
		create: (properties) => $ot.command('work:boards:create', properties),
		update: (properties) => $ot.command('work:boards:update', properties),
		delete: (slug) => $ot.command('work:boards:delete', { slug })
	}
};
