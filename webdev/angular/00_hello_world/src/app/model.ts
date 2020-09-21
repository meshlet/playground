export class TodoItem {
  private action: string;
  private done: boolean;

  constructor(action: string, done: boolean) {
    this.action = action;
    this.done = done;
  }

  get Action(): string {
    return this.action;
  }

  set Action(action: string) {
    this.action = action;
  }

  get Done(): boolean {
    return this.done;
  }

  set Done(done: boolean) {
    this.done = done;
  }
}

export class Model {
  private user: string;
  private items: TodoItem[];

  constructor() {
    this.user = 'Dzanan';
    this.items = [
      new TodoItem('Buy food', false),
      new TodoItem('Register for football', true),
      new TodoItem('Go to cinema', false),
      new TodoItem('Write report', false)
    ];
  }

  get User(): string {
    return this.user;
  }

  get Items(): TodoItem[] {
    return this.items;
  }
}
