onetype.EmitRegister('work.tasks.create', {
    description: 'A task was created.',
    metadata: { addon: 'work.tasks' },
    config: {
        task: {
            type: 'object',
            config: 'work.task',
            description: 'The created task.'
        }
    }
});
