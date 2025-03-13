import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService } from './services/task.service';
import { FilterStatusType, FilterTask, Task, Tasks } from './models/task.model';
import { TaskTableComponent } from './components/task-table/task-table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(TaskTableComponent) taskTable: TaskTableComponent; 
  private taskList_: Tasks = [];
  showConfirmationModal = false;
  deletedTask: Task;
  tasks: Tasks = [];

  taskForm: FormGroup = new FormGroup({
    taskTitle: new FormControl('', Validators.required)
  });

  constructor(private taskService: TaskService) {
    this.taskService.getTasks().subscribe(tasks => this.taskList_ = tasks);
  }

  ngOnInit(): void {
    this.tasks = this.taskList_;
  }

  markAs(mark: FilterTask): void {
    this.taskList_[mark.index].finished = (event.target as HTMLInputElement).checked;
    this.taskService.updateTask(this.taskList_[mark.index]).subscribe();
  }
 
  addTask(): void {
    const label = this.taskForm.controls['taskTitle'].value as string;
    this.taskService.createNewTask({label, finished: false}).subscribe(res => {
      this.taskList_ = res;
      this.tasks = res;
    });
    this.taskForm.reset();
  }

  removeTask(id: string): void {
    this.showConfirmationModal = true;
    this.taskService.getTaskById(id).subscribe(res => this.deletedTask = res)
  }

  filterTasks(label: string): void {
    this.taskTable.status.setValue('ALL', {emitEvent: false});
    this.taskService.getTasksByLabel(label).subscribe(res => this.tasks = res);
  }

  filterTaskStatus(event: Event): void {
    const status = (event.target as HTMLSelectElement).value as FilterStatusType;
    this.taskTable.filter.setValue('', {emitEvent: false});
    switch(status) {
      case 'ALL':
        this.tasks = this.taskList_;
        break;

      case 'COMPLETE': 
        this.taskService.getTasksByStatus(true).subscribe(res => this.tasks = res);
        break;

      case 'INCOMPLETE': 
        this.taskService.getTasksByStatus(false).subscribe(res => this.tasks = res);
        break;
    }
  }
  
  onConfirm(): void {
    this.taskService.deleteTask(this.deletedTask.id).subscribe(res => {
      this.taskList_ = res;
      this.tasks = res;
      this.showConfirmationModal = false;
    });
  }

  onCancel(): void {
    this.showConfirmationModal = false;
    this.deletedTask = null;
  }
}
