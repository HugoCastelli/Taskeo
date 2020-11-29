import {Injectable} from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  constructor() {
  }

  // Afiche un toaster succès
  showSuccess(message: string): void {
    this.toast.fire({ title: message, icon: 'success' }).then();
  }

  // Afiche un toaster erreur
  showError(message: string): void {
    this.toast.fire({ title: message, icon: 'error' }).then();
  }
}
