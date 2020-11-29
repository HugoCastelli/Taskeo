import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/fr';
import {DialogTasksComponent} from '@components/dialog-tasks/dialog-tasks.component';
import {MatDialog} from '@angular/material/dialog';
import {TasksService} from '@services/tasks.service';
import {NotificationService} from '@services/notification.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.sass']
})
export class TaskComponent implements OnInit, OnDestroy {

  @Input() task: any;
  @Output() taskEdited: EventEmitter<any> = new EventEmitter<any>();
  moment: any = moment;
  timer: any;
  interval: any;

  constructor(public dialog: MatDialog, public tasksService: TasksService, private notificationService: NotificationService) {
    moment.locale('fr');
  }

  ngOnInit(): void {
    this.timer = moment(this.task.timer, 'HH:mm:ss').format('HH:mm');
    this.time();
  }

  time(): any {
    this.interval = setInterval(() => {
      if (this.task.status === 'running') {
        this.timer = moment(this.timer, 'HH:mm:ss').add(1, 'minutes').format('HH:mm');
      }
    }, 60000);
  }

  editTask(task: any): void {
    const dialogRef = this.dialog.open(DialogTasksComponent, {
      maxHeight: '100vh',
      data: task
    });
    this.dialogClose(dialogRef);
  }

  async deleteTask(): Promise<void> {
    await this.tasksService.deleteTask(this.task.taskId).subscribe(() => {
      this.notificationService.showSuccess('Votre tâche a été supprimé.');
      this.taskEdited.emit();
    }, () => {
      this.notificationService.showError('Votre tâche n\'a pas pu être suprimmé');
    });
  }

  async updateTimer(): Promise<void> {
    const status = this.task.status === 'stopped' ? 'running' : this.task.status === 'paused' ? 'running' : 'paused';

    await this.tasksService.updateTaskTimer(status, this.task.taskId).subscribe((res: any) => {
      this.task = res;
    });
  }

  dialogClose(ref: any): void {
    ref.afterClosed().subscribe((res: any) => {
      this.task = res;
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
