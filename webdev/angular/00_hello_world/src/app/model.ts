export class TodoItem {
  private action: string;
  private done: boolean;

  constructor(action: string, done: boolean) {
    this.action = action;
    this.done = done;
  }

  getAction(): string {
    return this.action;
  }

  getDone(): boolean {
    return this.done;
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

  getName(): string {
    return this.user;
  }

  getTodoItems(): TodoItem[] {
    return this.items;
  }
}
