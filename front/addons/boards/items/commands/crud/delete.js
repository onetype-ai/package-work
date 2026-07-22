commands.Item({
    id: 'work:boards:delete',
    description: 'Deletes a user created board. Boards declared by packages cannot be removed.',
    metadata: { addon: 'work.boards' },
    in: {
        slug: {
            type: 'string',
            required: true,
            description: 'Slug of the board to delete.'
        }
    },
    out: 'work.board',
    callback: async function(properties, resolve)
    {
        const confirmed = await $ot.float.confirm('Delete board?', 'Every task on it stays stored, but the board disappears for everyone.', { type: 'danger' });

        if(!confirmed)
        {
            return resolve(null, 'Deletion was cancelled.', 400);
        }

        const { data, message, code } = await $ot.command('work:boards:delete', properties, true);

        if(code !== 200)
        {
            $ot.float.toast({ message, type: 'error' });

            return resolve(null, message, code);
        }

        $ot.float.toast({ message, type: 'success' });

        resolve(data);
    }
});
