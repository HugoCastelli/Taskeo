import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http: HttpClient) {
  }

  getTasks(params?: any): Observable<any[]> {
    let filters = '';
    if (params) {
      filters = `?priority=${params}`;
    }
    return this.http.get<any[]>(`${environment.apiUrl}/tasks${filters}`);
  }

  createTask(form: any): any {
    Object.assign(form, {creationDate: new Date()});
    return this.http.post<any>(`${environment.apiUrl}/tasks`, form);
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/tasks/${taskId}`);
  }

  updateTask(form: any, taskId: string): any {
    return this.http.put<any>(`${environment.apiUrl}/tasks/${taskId}`, form);
  }

  updateTaskTimer(status: string, taskId: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/tasks/updateTimers/${taskId}`, { status });
  }
}
