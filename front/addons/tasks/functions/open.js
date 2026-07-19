onetype.AddonReady('work.tasks', (tasks) =>
{
	tasks.Fn('open', function(given)
	{
		const task = {
			board: given.board ? given.board : 'general',
			description: '',
			status: 'Backlog',
			author: null,
			assignee: null,
			created: given.created ? given.created : (given.date ? given.date : ''),
			worked: 0,
			locked: null,
			working: null,
			question: null,
			comments: [],
			...given
		};

		return $ot.float.drawer({
			id: 'work-task-' + task.id,
			position: 'right',
			clean: true,
			width: 'l',
			padding: 'none',
			content: function()
			{
				this.task = task;

				return /* html */ `<e-work-task :task="task" :_close="close"></e-work-task>`;
			}
		});
	});
});
