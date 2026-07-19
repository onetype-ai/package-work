import onetype from '@onetype/framework';

onetype.AddonReady('work.boards', (boards) =>
{
	boards.Item({
		id: 'general',
		slug: 'general',
		name: 'General',
		icon: 'space_dashboard',
		description: 'The default board every instance starts with. Work that belongs nowhere else lives here.',
		columns: [
			{ value: 'Backlog', label: 'Backlog', color: 'brand', create: true },
			{ value: 'Planned', label: 'Planned', color: 'blue', create: true },
			{ value: 'Working', label: 'Working', color: 'orange', create: true },
			{ value: 'Review', label: 'Review', color: 'red', create: false },
			{ value: 'Done', label: 'Done', color: 'green', create: false }
		],
		order: 10
	});
});
