onetype.EmitRegister('work.tasks.complete', {
    description: 'A task was completed and landed in the final column.',
    metadata: { addon: 'work.tasks' },
    config: {
        task: {
            type: 'object',
            config: 'work.task',
            description: 'The completed task.'
        },
        from: {
            type: 'string',
            description: 'Column the task came from.'
        }
    }
});
