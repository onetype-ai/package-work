onetype.emitters.ItemAdd({
    id: 'work.tasks.move',
    description: 'A task moved to another column.',
    metadata: { addon: 'work.tasks' },
    config: {
        task: {
            type: 'object',
            config: 'work.task',
            description: 'The task after the move.'
        },
        from: {
            type: 'string',
            description: 'Column the task left.'
        },
        to: {
            type: 'string',
            description: 'Column the task landed in.'
        }
    }
});
