onetype.AddonReady('work.tasks', (tasks) =>
{
	tasks.Fn('open', function(given)
	{
		const task = onetype.DataDefine({ created_at: given.date, ...given }, onetype.DataSchema('work.task'));

		return $ot.float.drawer({
			id: 'work-task-' + task.id,
			position: 'right',
			clean: true,
			width: 'l',
			padding: 'none',
			content: function()
			{
				this.task = task;
				this.exit = () => this.dismiss();

				return /* html */ `<e-work-task :task="task" :_close="exit"></e-work-task>`;
			}
		});
	});
});
