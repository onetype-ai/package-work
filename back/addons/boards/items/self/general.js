onetype.AddonReady('work.boards', (boards) =>
{
    boards.Item({
        id: 'general',
        slug: 'general',
        name: 'General',
        icon: 'space_dashboard',
        description: 'The default board every instance starts with. Work that belongs nowhere else lives here.',
        columns: [
            { value: 'Backlog', label: 'Backlog', color: 'brand', canCreate: true },
            { value: 'Planned', label: 'Planned', color: 'blue', canCreate: true },
            { value: 'Working', label: 'Working', color: 'orange', canCreate: true },
            { value: 'Review', label: 'Review', color: 'red', canCreate: false },
            { value: 'Done', label: 'Done', color: 'green', canCreate: false, isFinal: true }
        ],
        order: 10
    });
});
