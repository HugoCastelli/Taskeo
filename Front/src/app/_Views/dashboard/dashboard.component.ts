import {Component} from '@angular/core';
import {TasksService} from '@services/tasks.service';
import {DialogTasksComponent} from '@components/dialog-tasks/dialog-tasks.component';
import {MatDialog} from '@angular/material/dialog';
import {AuthenticationService} from '@services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent {

  tasks: any;
  public activeValue = '';

  constructor(private tasksService: TasksService, public dialog: MatDialog, public auth: AuthenticationService) {
    this.getTasks();
  }

  get profile(): any {
    return this.auth.currentUserValue;
  }

  async getTasks(): Promise<void> {
    await this.tasksService.getTasks(this.activeValue ? this.activeValue : '').subscribe((res: any[]) => {
      this.tasks = res;
    });
  }

  openTasksCreation(): void {
    const dialogRef = this.dialog.open(DialogTasksComponent, {
      maxHeight: '100vh'
    });
    this.dialogClose(dialogRef);
  }

  dialogClose(ref: any): void {
    ref.afterClosed().subscribe(() => {
      this.getTasks();
    });
  }

  onChange(event: any): void {
    if (this.activeValue === event.value) {
      this.activeValue = '';
    } else {
      this.activeValue = event.value;
    }
    this.getTasks();
  }
}
