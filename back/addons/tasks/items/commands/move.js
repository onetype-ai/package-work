import commands from 'addon-commands';
import work from '#work/addon.js';

commands.Item({
    id: 'work:tasks:move',
    exposed: true,
    method: 'POST',
    endpoint: '/api/work/tasks/:id/move',
    description: 'Moves a task to another column of its board.',
    metadata: { addon: 'work.tasks' },
    condition: function()
    {
        if(this.http && !this.http.state.user)
        {
            return 'Sign in to manage tasks.';
        }
    },
    in: {
        id: {
            type: 'string',
            required: true,
            description: 'Id of the task to move.'
        },
        status: {
            type: 'string',
            required: true,
            description: 'Column to move the task into.'
        }
    },
    out: 'work.task',
    callback: async function(properties, resolve)
    {
        const item = await work.tasks.Fn('get', properties.id);

        if(!item)
        {
            return resolve(null, 'Task ' + properties.id + ' does not exist.', 404);
        }

        const board = work.boards.Fn('get', item.Get('board'));
        const columns = board ? board.Get('columns') || [] : [];

        if(columns.length && !columns.some((column) => column.value === properties.status))
        {
            return resolve(null, 'Board ' + item.Get('board') + ' has no ' + properties.status + ' column.', 400);
        }

        const from = item.Get('status');

        if(from === properties.status)
        {
            return resolve(await work.tasks.Fn('serialize', item), 'Task already sits in ' + from + '.');
        }

        item.Set('status', properties.status);
        item.Set('updated_at', new Date().toISOString());

        await item.Update();

        const task = await work.tasks.Fn('serialize', item);

        onetype.emitters.fire('work.tasks.move', { task, from, to: properties.status });

        resolve(task, 'Task ' + task.title + ' moved from ' + from + ' to ' + properties.status + '.');
    }
});
