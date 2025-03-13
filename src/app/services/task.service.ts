import { Injectable } from '@angular/core';
import { Task, Tasks } from '../models/task.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Tasks = [];

  constructor() {
    this.getTasks().subscribe(res => this.tasks = res);
  }

  saveTasks(taskList: Tasks = []): void {
    localStorage.setItem('taskList', JSON.stringify(taskList));
  }

  createNewTask(task: Omit<Task, 'id'>): Observable<Tasks> {
    this.tasks.push({id: this.generateId(), ...task});
    this.saveTasks(this.tasks);
    return of(this.tasks);
  }

  getTasks(): Observable<Tasks> {
    return of(localStorage.getItem('taskList') ? JSON.parse(localStorage.getItem('taskList')) as Tasks : []);
  }
  
  getTaskById(id:string): Observable<Task> {
    return of(this.tasks.find(t => t.id === id));
  }
  
  getTasksByLabel(label: string): Observable<Tasks> {
    return of(this.tasks.filter(t => t.label.toLowerCase().includes(label?.toLowerCase())));
  }
  
  getTasksByStatus(status: boolean): Observable<Tasks> {
    return of(this.tasks.filter(t => t.finished === status));
  }

  updateTask(task: Task): Observable<Tasks> {
    const index = this.tasks.findIndex(t => t.id === task.id);
    this.tasks[index] = task;
    this.saveTasks(this.tasks);

    return of(this.tasks);
  }

  deleteTask(id: string): Observable<Tasks> {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks(this.tasks);

    return of(this.tasks);
  }

  private generateId(): string {
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000);
    return `id-${timestamp}-${randomPart.toString().padStart(3, '0')}`;
  }

}
