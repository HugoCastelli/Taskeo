import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TasksService} from '@services/tasks.service';
import {NotificationService} from '@services/notification.service';

interface Priority {
  name: string;
  value: string;
}

@Component({
  selector: 'app-dialog-tasks',
  templateUrl: './dialog-tasks.component.html',
  styleUrls: ['./dialog-tasks.component.sass']
})
export class DialogTasksComponent {

  taskForm: FormGroup;
  priority: Priority[] = [
    {name: 'Haut', value: 'high'},
    {name: 'Moyen', value: 'medium'},
    {name: 'Bas', value: 'low'},
  ];

  constructor(public dialogRef: MatDialogRef<DialogTasksComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder, private tasksService: TasksService, private notification: NotificationService) {
    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
      priority: ['low', Validators.required],
      description: ['', Validators.required]
    });
    if (this.data) {
      this.taskForm.patchValue({
        name: this.data.name,
        priority: this.data.priority,
        description: this.data.description
      });
    }
  }

  get f(): any {
    return this.taskForm.controls;
  }

  editTask(): void {
    if (!this.taskForm.valid) {
      return;
    }
    this.tasksService.updateTask(this.taskForm.value, this.data.taskId).subscribe((res: any) => {
      this.data = res;
      this.notification.showSuccess('Votre tâche a été mise à jour');
      this.closeDialog();
    }, () => {
      this.notification.showError('Impossible de mettre à jour la tâche');
      this.closeDialog();
    });
  }

  submitTask(): void {
    if (!this.taskForm.valid) {
      return;
    }

    this.tasksService.createTask(this.taskForm.value).subscribe(() => {
      this.notification.showSuccess('Votre tâche a été créée');
      this.closeDialog();
    }, () => {
      this.notification.showError('Impossible de créer la tâche');
      this.closeDialog();
    });
  }

  // Ferme la dialog Authentification
  closeDialog(): void {
    this.dialogRef.close(this.data);
  }
}
