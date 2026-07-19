import '#work/addons/boards/addon.js';

/* Core */
import '#work/addons/boards/core/schemas/board.js';
import '#work/addons/boards/core/emitters/create.js';
import '#work/addons/boards/core/emitters/update.js';
import '#work/addons/boards/core/emitters/delete.js';

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

/* Listeners */
import '#work/addons/boards/listeners/boot.js';
