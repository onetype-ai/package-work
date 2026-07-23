onetype.AddonReady('admin.apps', (apps) =>
{
    apps.Item({
        id: 'work',
        name: 'Work',
        icon: 'view_kanban',
        color: 'rgba(251, 146, 60, 1)',
        description: 'The work layer of the instance. Tasks that humans and agents create, pick up and complete — one board, every worker.',
        order: 2
    });
});
