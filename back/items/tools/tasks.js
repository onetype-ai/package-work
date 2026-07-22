/*
    The work commands as agent tools. Each tool runs its command directly
    — one door for humans over HTTP and agents over tools, exactly as the
    package promises. Not global: they belong to the Work agent.
*/

const tools = [
    {
        id: 'work:boards:many',
        name: 'List boards',
        description: 'Lists every board with its columns — call it to learn which boards and statuses exist.',
        input: {}
    },
    {
        id: 'work:tasks:many',
        name: 'List tasks',
        description: 'Lists tasks, optionally narrowed to one board, status or assignee. Includes open question counts.',
        input: {
            board: { type: 'string', description: 'Board slug to filter by. Empty lists every board.' },
            status: { type: 'string', description: 'Column status to filter by.' },
            assignee_user: { type: 'string', description: 'User id whose tasks to list.' },
            assignee_agent: { type: 'string', description: 'Agent slug whose tasks to list.' }
        }
    },
    {
        id: 'work:tasks:one',
        name: 'Get task',
        description: 'Returns one task in full, with the whole comment and question trail.',
        input: {
            id: { type: 'string', required: true, description: 'Id of the task to fetch.' }
        }
    },
    {
        id: 'work:tasks:create',
        name: 'Create task',
        description: 'Creates a task on a board.',
        input: {
            board: { type: 'string', description: 'Board slug, default general.' },
            title: { type: 'string', required: true, description: 'Short task title.' },
            description: { type: 'string', description: 'What needs to be done, in markdown.' },
            status: { type: 'string', description: 'Column to create the task in. Omitted takes the first column.' },
            priority: { type: 'string', description: 'Low, Normal, High or Urgent. Default Normal.' },
            assignee_user: { type: 'string', description: 'User id to assign the task to.' },
            assignee_agent: { type: 'string', description: 'Agent slug to assign the task to.' },
            schedule_end: { type: 'string', description: 'Deadline, ISO timestamp.' }
        }
    },
    {
        id: 'work:tasks:update',
        name: 'Update task',
        description: 'Changes the title, description, priority or schedule of a task. Use Move task for status changes.',
        input: {
            id: { type: 'string', required: true, description: 'Id of the task to update.' },
            title: { type: 'string', description: 'New title.' },
            description: { type: 'string', description: 'New description.' },
            priority: { type: 'string', description: 'New priority: Low, Normal, High or Urgent.' },
            schedule_end: { type: 'string', description: 'New deadline, ISO timestamp.' }
        }
    },
    {
        id: 'work:tasks:delete',
        name: 'Delete task',
        description: 'Deletes a task. It disappears from every board.',
        input: {
            id: { type: 'string', required: true, description: 'Id of the task to delete.' }
        }
    },
    {
        id: 'work:tasks:move',
        name: 'Move task',
        description: 'Moves a task to another column of its board.',
        input: {
            id: { type: 'string', required: true, description: 'Id of the task to move.' },
            status: { type: 'string', required: true, description: 'Column to move it into.' }
        }
    },
    {
        id: 'work:tasks:assign',
        name: 'Assign task',
        description: 'Assigns a task to a user or an agent, or clears the assignee when neither is given.',
        input: {
            id: { type: 'string', required: true, description: 'Id of the task to assign.' },
            user: { type: 'string', description: 'User id of the new assignee.' },
            agent: { type: 'string', description: 'Agent slug of the new assignee.' }
        }
    },
    {
        id: 'work:tasks:complete',
        name: 'Complete task',
        description: 'Completes a task — moves it to the final column and closes the running work session.',
        input: {
            id: { type: 'string', required: true, description: 'Id of the task to complete.' }
        }
    },
    {
        id: 'work:tasks:comments:create',
        name: 'Comment on task',
        description: 'Adds a comment to the trail of a task.',
        input: {
            task: { type: 'string', required: true, description: 'Id of the task to comment on.' },
            text: { type: 'string', required: true, description: 'The comment itself.' }
        }
    },
    {
        id: 'work:tasks:questions:create',
        name: 'Ask question',
        description: 'Asks a question on a task — flags that something blocks the work until someone answers.',
        input: {
            task: { type: 'string', required: true, description: 'Id of the task the question is about.' },
            text: { type: 'string', required: true, description: 'The question blocking the work.' }
        }
    },
    {
        id: 'work:tasks:questions:answer',
        name: 'Answer question',
        description: 'Answers an open question on a task, unblocking whoever asked it.',
        input: {
            id: { type: 'string', required: true, description: 'Id of the question to answer.' },
            answer: { type: 'string', required: true, description: 'The answer.' }
        }
    }
];

onetype.AddonReady('agents.tools', (registry) =>
{
    for(const tool of tools)
    {
        registry.Item({
            id: tool.id,
            name: tool.name,
            description: tool.description,
            input: tool.input,
            command: tool.id
        });
    }
});
