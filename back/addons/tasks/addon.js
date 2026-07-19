import onetype from '@onetype/framework';

onetype.AddonReady('work', (work) =>
{
	work.tasks = onetype.Addon('work.tasks', (addon) =>
	{
		addon.Table('work_tasks');
	});
});
