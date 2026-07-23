onetype.schemas.ItemAdd({
    id: 'work.person',
    config: {
        type: {
            type: 'string',
            value: 'user',
            options: ['user', 'agent'],
            description: 'Whether this is a person or an agent.'
        },
        id: {
            type: 'string',
            description: 'User id for a person, agent slug for an agent.'
        },
        name: {
            type: 'string',
            description: 'Display name, copied at the moment of reference.'
        }
    }
});
