import '#work/addons/tasks/addon.js';

/* Core */
import '#work/addons/tasks/_/schemas/person.js';
import '#work/addons/tasks/_/schemas/comment.js';
import '#work/addons/tasks/_/schemas/question.js';
import '#work/addons/tasks/_/schemas/task.js';
import '#work/addons/tasks/_/emitters/create.js';
import '#work/addons/tasks/_/emitters/update.js';
import '#work/addons/tasks/_/emitters/delete.js';
import '#work/addons/tasks/_/emitters/move.js';
import '#work/addons/tasks/_/emitters/assign.js';
import '#work/addons/tasks/_/emitters/complete.js';

/* Functions */
import '#work/addons/tasks/functions/get.js';
import '#work/addons/tasks/functions/actor.js';
import '#work/addons/tasks/functions/person.js';
import '#work/addons/tasks/functions/serialize.js';

/* Items */
import '#work/addons/tasks/items/commands/crud/create.js';
import '#work/addons/tasks/items/commands/crud/update.js';
import '#work/addons/tasks/items/commands/crud/delete.js';
import '#work/addons/tasks/items/commands/crud/one.js';
import '#work/addons/tasks/items/commands/crud/many.js';
import '#work/addons/tasks/items/commands/move.js';
import '#work/addons/tasks/items/commands/assign.js';
import '#work/addons/tasks/items/commands/complete.js';

/* Addons */
import '#work/addons/tasks/addons/comments/load.js';
import '#work/addons/tasks/addons/questions/load.js';
