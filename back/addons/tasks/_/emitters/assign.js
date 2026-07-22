onetype.EmitRegister('work.tasks.assign', {
    description: 'The assignee of a task changed.',
    metadata: { addon: 'work.tasks' },
    config: {
        task: {
            type: 'object',
            config: 'work.task',
            description: 'The task after the change, assignee included.'
        }
    }
});
