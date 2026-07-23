import '#work/addons/boards/addon.js';
import '#work/addons/boards/items/onetype-schemas/work.column.js';
import '#work/addons/boards/items/onetype-schemas/work.board.js';

/* Functions */
import '#work/addons/boards/functions/sync.js';
import '#work/addons/boards/functions/get.js';
import '#work/addons/boards/functions/list.js';

/* Items */
import '#work/addons/boards/items/self/general.js';
import '#work/addons/boards/items/commands/crud/many.js';
import '#work/addons/boards/items/commands/crud/create.js';
import '#work/addons/boards/items/commands/crud/update.js';
import '#work/addons/boards/items/commands/crud/delete.js';
import '#work/addons/boards/items/onetype-emitters/work.boards.create.js';
import '#work/addons/boards/items/onetype-emitters/work.boards.update.js';
import '#work/addons/boards/items/onetype-emitters/work.boards.delete.js';

/* Listeners */
import '#work/addons/boards/listeners/middlewares/boot.js';
