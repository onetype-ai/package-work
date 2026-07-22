import commands from '@onetype/framework/commands';
import work from '#work/addon.js';

commands.Item({
    id: 'work:tasks:delete',
    exposed: true,
    method: 'DELETE',
    endpoint: '/api/work/tasks/:id',
    description: 'Soft deletes a task. It disappears from every board but stays in the database.',
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
            description: 'Id of the task to delete.'
        }
    },
    out: {
        id: {
            type: 'string',
            description: 'Id of the deleted task.'
        }
    },
    callback: async function(properties, resolve)
    {
        const item = await work.tasks.Fn('get', properties.id);

        if(!item)
        {
            return resolve(null, 'Task ' + properties.id + ' does not exist.', 404);
        }

        item.Set('deleted_at', new Date().toISOString());
        item.Set('updated_at', new Date().toISOString());

        await item.Update();

        onetype.Emit('work.tasks.delete', { id: String(item.Get('id')) });

        resolve({ id: String(item.Get('id')) }, 'Task ' + item.Get('title') + ' was deleted.');
    }
});
