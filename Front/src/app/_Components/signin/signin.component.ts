import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '@services/notification.service';
import {AuthenticationService} from '@services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.sass']
})
export class SigninComponent {

  @Output() changeView: EventEmitter<any> = new EventEmitter<any>();
  signinForm: FormGroup;
  hide = true;

  constructor(private formBuilder: FormBuilder, private notification: NotificationService, private auth: AuthenticationService,
              private route: Router) {
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f(): any {
    return this.signinForm.controls;
  }

  submitLogin(): void {
    if (!this.signinForm.valid) {
      return;
    }

    this.auth.login(this.f.email.value, this.f.password.value).subscribe(() => {
      this.notification.showSuccess('Connecté avec succès');
      this.route.navigate(['/dashboard']);
    }, () => {
      this.notification.showError('Email ou mot de passe incorrect');
    });
  }
}
