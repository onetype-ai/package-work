import commands from 'addon-commands';
import work from '#work/addon.js';

commands.Item({
    id: 'work:boards:many',
    exposed: true,
    method: 'GET',
    endpoint: '/api/work/boards',
    description: 'Lists every board of the instance, package declared and user created, ordered for display.',
    metadata: { addon: 'work.boards' },
    out: {
        boards: {
            type: 'array',
            each: {
                type: 'object',
                config: 'work.board'
            },
            description: 'The boards, ordered for display.'
        }
    },
    callback: async function(properties, resolve)
    {
        const boards = work.boards.Fn('list');

        resolve({ boards });
    }
});
