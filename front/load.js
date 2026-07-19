$ot.work = {
	boards: {
		list: () => Object.values(work.boards.Items()).map((item) => item.GetData()),
		sync: () => work.boards.Fn('sync'),
		create: (properties) => $ot.command('work:boards:create', properties),
		update: (properties) => $ot.command('work:boards:update', properties),
		delete: (slug) => $ot.command('work:boards:delete', { slug })
	},
	tasks: {
		open: (task) => work.tasks.Fn('open', task)
	}
};
