import commands from 'addon-commands';
import work from '#work/addon.js';

commands.Item({
    id: 'work:boards:update',
    exposed: true,
    method: 'PUT',
    endpoint: '/api/work/boards/:slug',
    description: 'Updates the name, icon or description of a user created board.',
    metadata: { addon: 'work.boards' },
    condition: function()
    {
        if(this.http && !this.http.state.user)
        {
            return 'Sign in to manage boards.';
        }
    },
    in: {
        slug: {
            type: 'string',
            required: true,
            description: 'Slug of the board to update.'
        },
        name: {
            type: 'string',
            description: 'New name for the board.'
        },
        icon: {
            type: 'string',
            description: 'New material symbol for the board.'
        },
        description: {
            type: 'string',
            description: 'New description for the board.'
        },
        columns: {
            type: 'array',
            each: {
                type: 'object',
                config: 'work.column',
                description: 'A single column of the board.'
            },
            description: 'New columns of the board.'
        }
    },
    out: 'work.board',
    callback: async function(properties, resolve)
    {
        const item = work.boards.Fn('get', properties.slug);

        if(!item)
        {
            return resolve(null, 'Board ' + properties.slug + ' not found.', 404);
        }

        if(item.Get('id') === item.Get('slug'))
        {
            return resolve(null, 'Board ' + properties.slug + ' is declared by a package and cannot be changed.', 400);
        }

        const whitelist = [];

        for(const field of ['name', 'icon', 'description', 'columns'])
        {
            if(properties[field] !== null && properties[field] !== undefined)
            {
                item.Set(field, properties[field]);
                whitelist.push(field);
            }
        }

        if(!whitelist.length)
        {
            return resolve(null, 'Nothing to change on board ' + properties.slug + '.', 400);
        }

        await item.Update({ whitelist });

        const board = {
            slug: item.Get('slug'),
            name: item.Get('name'),
            icon: item.Get('icon'),
            description: item.Get('description'),
            columns: item.Get('columns'),
            order: item.Get('order'),
            isSystem: false
        };

        onetype.emitters.fire('work.boards.update', { board });

        resolve(board, 'Board ' + board.name + ' was updated.');
    }
});
