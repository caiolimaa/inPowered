import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { FilterOptions, FilterStatusType, FilterTask, Tasks } from 'src/app/models/task.model';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss']
})
export class TaskTableComponent implements OnInit {
  @Input() tasks: Tasks = [];
  @Output() markAs: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() removeTask: EventEmitter<number> = new EventEmitter<number>();
  @Output() filterTask: EventEmitter<FilterTask> = new EventEmitter<FilterTask>();
  @Output() filterTaskStatus: EventEmitter<FilterStatusType> = new EventEmitter<FilterStatusType>();

  filter: FormControl = new FormControl('');
  status: FormControl = new FormControl('ALL');
  filterOptions: FilterOptions = [];

  constructor() {
    this.filterOptions = [
      {label: 'ALL', value: 'ALL'},
      {label: 'COMPLETE', value: 'COMPLETE'},
      {label: 'INCOMPLETE', value: 'INCOMPLETE'},
    ]
  }

  ngOnInit(): void {
    this.filter.valueChanges
      .pipe(debounceTime(300))
      .subscribe(res => this.filterTask.emit(res));
  }

}
