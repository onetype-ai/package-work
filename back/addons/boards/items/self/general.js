import onetype from '@onetype/framework';

onetype.AddonReady('work.boards', (boards) =>
{
	boards.Item({
		slug: 'general',
		name: 'General',
		icon: 'space_dashboard',
		description: 'The default board every instance starts with. Work that belongs nowhere else lives here.',
		order: 10
	});
});
