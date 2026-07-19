onetype.AddonReady('elements', (elements) =>
{
	elements.ItemAdd({
		id: 'work-task',
		icon: 'assignment',
		name: 'Task',
		description: 'The full face of one task: header with status and actions, lock and working state with tracked time, open questions waiting for answers, description and comments in tabs.',
		category: 'Work',
		collection: 'Work',
		author: 'OneType',
		config: {
			task: {
				type: 'object',
				config: 'work.task',
				value: {
					id: 3,
					board: 'general',
					title: 'Kanban drag and drop',
					description: '## Goal\n\nCards move between columns with a **real drag** — grab, lift, drop. The drop persists the new status through the `work:tasks:move` command, nothing else touches the record.\n\n## Acceptance\n\n- Dragging lifts the card with a soft shadow, the source column keeps a ghost slot\n- Dropping onto a column fires `move` and the card lands **without a flicker**\n- Keyboard fallback: focus a card, `←` and `→` move it one column\n\n> Reordering *within* a column stays out of scope.',
					status: 'Working',
					author: { type: 'user', id: '1', name: 'Dejan Tomić' },
					assignee: { type: 'agent', id: 'orah', name: 'Orah' },
					locked_at: 'Jul 19, 14:02',
					working_since: '',
					worked: 8460,
					priority: 'High',
					schedule_start: '',
					schedule_end: '',
					questions: [
						{ id: 1, author: { type: 'agent', id: 'orah', name: 'Orah' }, text: 'Should a card dropped into Done also release the lock, or does release stay an explicit action?', answer: '', created_at: 'Jul 19, 15:12' }
					],
					comments: [
						{ id: 1, author: { type: 'user', id: '1', name: 'Dejan Tomić' }, text: 'Let us keep the drop animation subtle, nothing bouncy.', created_at: 'Jul 18, 11:20' },
						{ id: 2, author: { type: 'agent', id: 'orah', name: 'Orah' }, text: 'Agreed. I will reuse the board view transition tokens for it.', created_at: 'Jul 18, 11:24' }
					],
					created_at: 'Jul 15'
				},
				description: 'The task to show, shaped by the work.task schema.'
			},
			background: {
				type: 'number',
				value: 1,
				options: [0, 1, 2, 3],
				description: 'Background depth the panel sits on from 0 to 3. Everything nested sits one step above.'
			},
			_close: {
				type: 'function',
				description: 'Called without payload when the panel asks to close.'
			},
			_delete: {
				type: 'function',
				description: 'Called with { value } holding the task after the user confirms deletion.'
			},
			_change: {
				type: 'function',
				description: 'Called with { value } holding the task after any change made inside the panel.'
			}
		},
		render: function()
		{
			this.tab = 'overview';

			this.colors = { 'Backlog': 'brand', 'Planned': 'blue', 'Working': 'orange', 'Review': 'red', 'Done': 'green' };

			this.color = () => this.colors[this.task.status] ? this.colors[this.task.status] : 'brand';

			this.above = () => Math.min(this.background + 1, 3);

			this.me = () => ({
				type: 'user',
				id: this.state.user && this.state.user.id ? String(this.state.user.id) : '',
				name: this.state.user && this.state.user.name ? this.state.user.name : 'You'
			});

			this.holder = () => this.task.assignee ? this.task.assignee.name : 'Somebody';

			this.initials = (name) => name.split(' ').map((word) => word.charAt(0)).slice(0, 2).join('');

			this.format = (seconds) =>
			{
				const hours = Math.floor(seconds / 3600);
				const minutes = Math.floor((seconds % 3600) / 60);

				return hours ? hours + 'h ' + minutes + 'm' : minutes + 'm';
			};

			this.elapsed = () =>
			{
				const since = this.task.working_since ? new Date(this.task.working_since).getTime() : Date.now();

				return this.format(this.task.worked + Math.floor((Date.now() - since) / 1000));
			};

			this.opened = () => this.task.questions.filter((question) => !question.answer);

			this.asked = () =>
			{
				const open = this.opened();

				return open.length ? open[0] : null;
			};

			this.details = () => [
				{ label: 'Status', value: this.task.status, type: 'status', color: this.color() },
				{ label: 'Author', value: this.task.author ? this.task.author.name : null, type: 'person' },
				{ label: 'Assignee', value: this.task.assignee ? this.task.assignee.name : null, type: 'person', color: this.task.assignee && this.task.assignee.type === 'agent' ? 'green' : 'brand' },
				{ label: 'Priority', value: this.task.priority, type: 'status', color: this.task.priority === 'Urgent' ? 'red' : (this.task.priority === 'High' ? 'orange' : (this.task.priority === 'Low' ? 'blue' : 'brand')) },
				{ label: 'Board', value: this.task.board, type: 'chips' },
				{ label: 'Created', value: this.task.created_at, type: 'date' },
				{ label: 'Time worked', value: this.task.worked ? this.elapsed() : (this.task.working_since ? this.elapsed() : null), type: 'mono', icon: 'timer' }
			];

			this.tabs = () => [
				{ id: 'overview', label: 'Overview', icon: 'subject' },
				{ id: 'settings', label: 'Settings', icon: 'tune' },
				{ id: 'questions', label: 'Questions', icon: 'contact_support', count: this.opened().length },
				{ id: 'comments', label: 'Comments', icon: 'forum', count: this.task.comments.length }
			];

			this.people = [
				{ type: 'user', id: '1', name: 'Dejan Tomić' },
				{ type: 'user', id: '2', name: 'Ana Ilić' },
				{ type: 'user', id: '3', name: 'Stefan Pakić' },
				{ type: 'user', id: '4', name: 'Mila Kovač' }
			];

			this.agents = [
				{ type: 'agent', id: 'orah', name: 'Orah', description: 'The mind of the instance.' },
				{ type: 'agent', id: 'forge', name: 'Forge', description: 'Builds and ships the workbench tasks.' }
			];

			this.assigned = (person) => this.task.assignee ? this.task.assignee.type === person.type && this.task.assignee.id === person.id : false;

			this.assign = async (person) =>
			{
				const removing = this.assigned(person);
				const confirmed = await $ot.float.confirm(removing ? 'Unassign?' : 'Assign the task?', removing ? person.name + ' steps away and the task is up for grabs again.' : 'The task becomes ' + person.name + "'s responsibility.");

				if(!confirmed)
				{
					return;
				}

				this.change({
					...this.task,
					assignee: removing ? null : { type: person.type, id: person.id, name: person.name }
				});
			};

			this.peopleRows = () => this.people.map((person) => ({
				icon: 'person',
				label: person.name,
				value: this.assigned(person) ? 'Assigned' : '',
				color: 'brand',
				onClick: () => this.assign(person)
			}));

			this.agentRows = () => this.agents.map((agent) => ({
				icon: 'smart_toy',
				label: agent.name,
				sublabel: agent.description,
				value: this.assigned(agent) ? 'Assigned' : '',
				color: 'green',
				onClick: () => this.assign(agent)
			}));

			this.priorityOptions = [
				{ value: 'Low', label: 'Low', icon: 'stat_minus_1' },
				{ value: 'Normal', label: 'Normal', icon: 'equal' },
				{ value: 'High', label: 'High', icon: 'stat_1' },
				{ value: 'Urgent', label: 'Urgent', icon: 'local_fire_department' }
			];

			this.prioritize = () => ({ value }) =>
			{
				this.change({ ...this.task, priority: value });
			};

			this.start = () => ({ value }) =>
			{
				this.change({ ...this.task, schedule_start: value });
			};

			this.end = () => ({ value }) =>
			{
				this.change({ ...this.task, schedule_end: value });
			};

			this.plan = () =>
			{
				const start = this.task.schedule_start ? new Date(this.task.schedule_start).toLocaleDateString() : '';
				const end = this.task.schedule_end ? new Date(this.task.schedule_end).toLocaleDateString() : '';
				const opening = start ? 'Starts ' + start : 'Starts when someone takes it';

				return end ? opening + ', due ' + end + '.' : opening + ', no deadline.';
			};

			this.pick = () => ({ value }) =>
			{
				this.tab = value;
			};

			this.change = (task) =>
			{
				this.task = task;

				if(this._change)
				{
					this._change({ value: task });
				}
			};

			this.take = async () =>
			{
				const confirmed = await $ot.float.confirm('Take this task?', 'You become the assignee, the task locks to you and the clock starts.');

				if(!confirmed)
				{
					return;
				}

				const now = new Date();

				this.change({
					...this.task,
					status: 'Working',
					assignee: this.me(),
					locked_at: now.toISOString(),
					working_since: now.toISOString()
				});
			};

			this.columns = () =>
			{
				const item = Object.values(work.boards.Items()).find((entry) => entry.Get('slug') === this.task.board);
				const columns = item ? item.Get('columns') : [];

				return columns.length ? columns : Object.keys(this.colors).map((status) => ({ value: status, label: status, isFinal: status === 'Done' }));
			};

			this.statuses = () => this.columns().map((column) => ({ value: column.value, label: column.label ? column.label : column.value }));

			this.final = () =>
			{
				const column = this.columns().find((entry) => entry.isFinal);

				return column ? column.value : 'Done';
			};

			this.finished = () => this.task.status === this.final();

			this.move = () => async ({ value }) =>
			{
				if(value === this.task.status)
				{
					return;
				}

				const confirmed = await $ot.float.confirm('Move the task?', 'The task moves from ' + this.task.status + ' to ' + value + '.');

				if(!confirmed)
				{
					return;
				}

				this.change({ ...this.task, status: value });
			};

			this.complete = async () =>
			{
				const confirmed = await $ot.float.confirm('Complete the task?', 'The task lands in ' + this.final() + ', the lock releases and the clock stops.');

				if(!confirmed)
				{
					return;
				}

				const since = this.task.working_since ? new Date(this.task.working_since).getTime() : null;

				this.change({
					...this.task,
					worked: since ? this.task.worked + Math.floor((Date.now() - since) / 1000) : this.task.worked,
					locked_at: null,
					working_since: null,
					status: this.final()
				});
			};

			this.remove = async () =>
			{
				const confirmed = await $ot.float.confirm('Delete task?', 'The task and its comments disappear from the board for everyone.', { type: 'danger' });

				if(!confirmed)
				{
					return;
				}

				if(this._delete)
				{
					this._delete({ value: this.task });
				}

				this.dismiss();
			};

			this.release = async () =>
			{
				const confirmed = await $ot.float.confirm('Release the task?', 'The session time lands in the total, the lock opens and the task moves to Review.');

				if(!confirmed)
				{
					return;
				}

				const since = this.task.working_since ? new Date(this.task.working_since).getTime() : Date.now();

				this.change({
					...this.task,
					worked: this.task.worked + Math.floor((Date.now() - since) / 1000),
					locked_at: null,
					working_since: null,
					status: 'Review'
				});
			};

			this.respond = (id, answer) =>
			{
				this.change({
					...this.task,
					questions: this.task.questions.map((entry) => entry.id === id ? { ...entry, answer: answer, answered_by: this.me(), answered_at: new Date().toLocaleString() } : entry)
				});
			};

			this.ask = (text) =>
			{
				this.change({
					...this.task,
					questions: [...this.task.questions, { id: 'now-' + this.task.questions.length, author: this.me(), text: text, answer: '', created_at: new Date().toLocaleString() }]
				});
			};

			this.questionEntries = () => this.task.questions.map((question) => ({
				id: question.id,
				author: question.author,
				at: question.created_at,
				text: question.text,
				replyable: true,
				reply: question.answer ? { author: question.answered_by, at: question.answered_at, text: question.answer } : null
			}));

			this.commentEntries = () => this.task.comments.map((comment) => ({
				id: comment.id,
				author: comment.author,
				at: comment.created_at,
				text: comment.text
			}));

			this.comment = (text) =>
			{
				this.change({
					...this.task,
					comments: [...this.task.comments, { id: 'now-' + this.task.comments.length, author: this.me(), text: text, created_at: new Date().toLocaleString() }]
				});
			};

			this.banner = ({ event }) =>
			{
				const form = onetype.FormGet(event.target);
				const question = this.asked();

				if(form.answer && question)
				{
					this.respond(question.id, form.answer);
				}
			};

			this.dismiss = () =>
			{
				if(this._close)
				{
					this._close();
				}
			};

			return /* html */ `
				<div :class="'box bg-' + background">
					<div class="head">
						<div class="path">
							<span class="board"><i>view_kanban</i>{{ task.board }}</span>
							<span class="number">#{{ task.id }}</span>
							<button class="close" ot-click="() => dismiss()"><i>close</i></button>
						</div>
						<span class="title">{{ task.title }}</span>
						<div class="meta">
							<span :class="'status ' + color()"><span class="dot"></span>{{ task.status }}</span>
							<span ot-if="task.assignee" class="person" :ot-tooltip="'Assignee'"><span class="avatar">{{ initials(task.assignee.name) }}</span>{{ task.assignee.name }}</span>
							<span class="created">Created {{ task.created_at }}</span>
						</div>
					</div>

					<div ot-if="task.working_since" class="banner working">
						<i>bolt</i>
						<span class="text"><b>{{ holder() }}</b> is working on this right now</span>
						<span class="time">{{ elapsed() }}</span>
					</div>
					<div ot-if="task.locked_at && !task.working_since" class="banner locked">
						<i>lock</i>
						<span class="text">Locked by <b>{{ holder() }}</b> since {{ task.locked_at }}</span>
					</div>

					<div class="actions">
						<e-form-button ot-if="!task.working_since && !finished()" text="Take this task" icon="front_hand" color="brand" :_click="() => take()"></e-form-button>
						<e-form-button ot-if="task.working_since" text="Release" icon="outbound" color="green" tone="soft" :_click="() => release()"></e-form-button>
						<div class="status">
							<e-form-select :value="task.status" :options="statuses()" :searchable="false" :background="above()" :_change="move()"></e-form-select>
						</div>
						<span ot-if="task.worked || task.working_since" class="worked" :ot-tooltip="'Time worked in total'"><i>timer</i>{{ elapsed() }}</span>
						<e-form-button ot-if="!finished()" text="" icon="check_circle" color="green" tone="ghost" :ot-tooltip="'Complete the task'" :_click="() => complete()"></e-form-button>
						<e-form-button text="" icon="delete" color="red" tone="ghost" :ot-tooltip="'Delete the task'" :_click="() => remove()"></e-form-button>
					</div>

					<div class="tabs">
						<e-navigation-tabs :items="tabs()" :active="tab" tone="segmented" :background="above()" :_change="pick()"></e-navigation-tabs>
					</div>

					<div ot-if="tab === 'overview'" class="body overview">
						<div class="scroll">
							<div ot-if="asked()" class="question">
								<div class="ask">
									<i>contact_support</i>
									<div class="words">
										<span class="who">{{ asked().author ? asked().author.name : 'Somebody' }} asks · {{ asked().created_at }}</span>
										<span class="what">{{ asked().text }}</span>
									</div>
								</div>
								<form class="reply" ot-submit.prevent="(payload) => banner(payload)">
									<textarea name="answer" rows="2" placeholder="Answer the question and unblock the work..."></textarea>
									<div class="send">
										<e-form-button text="" icon="send" color="orange" :ot-tooltip="'Answer'" type="submit"></e-form-button>
									</div>
								</form>
							</div>

							<e-global-markdown :content="task.description" :background="0"></e-global-markdown>
						</div>

						<e-data-details :items="details()" :background="above()"></e-data-details>
					</div>

					<div ot-if="tab === 'settings'" class="body">
						<div class="scroll">
							<span class="group">Priority</span>
							<e-form-options :value="task.priority" :options="priorityOptions" :background="above()" :_change="prioritize()"></e-form-options>
							<div class="dates">
								<div class="date">
									<span class="group">Starts</span>
									<e-form-date :value="task.schedule_start" :background="above()" :_change="start()"></e-form-date>
								</div>
								<div class="date">
									<span class="group">Ends</span>
									<e-form-date :value="task.schedule_end" :background="above()" :_change="end()"></e-form-date>
								</div>
							</div>
							<span class="group">People</span>
							<e-data-list :rows="peopleRows()" :search="true" placeholder="Find a person..." :background="above()"></e-data-list>
							<span class="group">Agents</span>
							<e-data-list :rows="agentRows()" :search="true" placeholder="Find an agent..." :background="above()"></e-data-list>
						</div>
						<e-global-notice title="Schedule" :text="plan()" icon="event_upcoming" color="blue" :background="above()"></e-global-notice>
					</div>

					<div ot-if="tab === 'questions'" class="body">
						<e-data-thread :entries="questionEntries()" color="orange" waiting="Waiting for an answer" placeholder="Ask a question..." replyPlaceholder="Answer and unblock the work..." emptyIcon="contact_support" emptyTitle="No questions yet" emptyDescription="When the work hits a wall, ask below." :background="background" :_send="({ value }) => ask(value)" :_reply="({ id, value }) => respond(id, value)"></e-data-thread>
					</div>

					<div ot-if="tab === 'comments'" class="body">
						<e-data-thread :entries="commentEntries()" placeholder="Write a comment..." emptyIcon="forum" emptyTitle="No comments yet" emptyDescription="Say the first word below." :background="background" :_send="({ value }) => comment(value)"></e-data-thread>
					</div>
				</div>
			`;
		}
	});
});
