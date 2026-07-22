import commands from '@onetype/framework/commands';
import work from '#work/addon.js';

commands.Item({
    id: 'work:tasks:assign',
    exposed: true,
    method: 'POST',
    endpoint: '/api/work/tasks/:id/assign',
    description: 'Assigns a task to a user or an agent, or clears the assignee when neither is given.',
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
            description: 'Id of the task to assign.'
        },
        user: {
            type: 'string',
            description: 'User id of the new assignee. Leave empty when assigning an agent.'
        },
        agent: {
            type: 'string',
            description: 'Agent slug of the new assignee. Leave empty when assigning a person.'
        }
    },
    out: 'work.task',
    callback: async function(properties, resolve)
    {
        if(properties.user && properties.agent)
        {
            return resolve(null, 'A task is assigned to a user or an agent, not both.', 400);
        }

        const item = await work.tasks.Fn('get', properties.id);

        if(!item)
        {
            return resolve(null, 'Task ' + properties.id + ' does not exist.', 404);
        }

        if(properties.agent && $ot.agents && $ot.agents.items && !$ot.agents.items().some((entry) => entry.Get('id') === properties.agent))
        {
            return resolve(null, 'Agent ' + properties.agent + ' is not registered.', 404);
        }

        item.Set('assignee_user_id', properties.user || null);
        item.Set('assignee_agent', properties.agent || null);
        item.Set('updated_at', new Date().toISOString());

        await item.Update();

        const task = await work.tasks.Fn('serialize', item);

        onetype.Emit('work.tasks.assign', { task });

        resolve(task, task.assignee
            ? 'Task ' + task.title + ' is now assigned to ' + task.assignee.name + '.'
            : 'Task ' + task.title + ' is now unassigned.');
    }
});
