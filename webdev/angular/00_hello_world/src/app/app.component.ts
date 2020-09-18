import { Component } from '@angular/core';
import { Model, TodoItem } from './model';

@Component({
  selector: 'app-hello-world',
  templateUrl: './app.component.html'
})

export class AppComponent {
  private model = new Model();

  getName(): string {
    return this.model.getName();
  }

  getTodoItems(): TodoItem[] {
    return this.model.getTodoItems();
  }
}
