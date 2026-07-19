onetype.AddonReady('work.tasks', (tasks) =>
{
	tasks.Fn('open', function(given)
	{
		const task = onetype.DataDefine({ created: given.date, ...given }, onetype.DataSchema('work.task'));

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
