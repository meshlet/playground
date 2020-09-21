import { Component } from '@angular/core';
import { Model, TodoItem } from './model';

@Component({
  selector: 'app-hello-world',
  templateUrl: './app.component.html'
})

export class AppComponent {
  private model = new Model();

  getUser(): string {
    return this.model.User;
  }

  getTodoItems(): TodoItem[] {
    return this.model.Items.filter(item => !item.Done);
  }

  addItem(action: string): void {
    if (action !== '') {
      this.model.Items.push(new TodoItem(action, false));
    }
  }
}
