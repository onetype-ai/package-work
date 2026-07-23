onetype.AddonReady('admin.screens', (screens) =>
{
    screens.Item({
        id: 'work',
        route: '/work',
        app: 'work',
        metadata: { addon: 'work' }
    });
});
