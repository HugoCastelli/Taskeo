import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from '@utils/mustMatch/must-match.validator';
import {NotificationService} from '@services/notification.service';
import {AuthenticationService} from '@services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass']
})
export class SignupComponent {

  @Output() changeView: EventEmitter<any> = new EventEmitter<any>();
  signupForm: FormGroup;
  hide = true;

  constructor(private formBuilder: FormBuilder, private notification: NotificationService, private auth: AuthenticationService) {
    this.signupForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validators: [
        MustMatch('password', 'confirmPassword'),
      ]
    });
  }

  get f(): any {
    return this.signupForm.controls;
  }

  submitSignUp(): void {
    if (!this.signupForm.valid) { return; }

    this.auth.register(this.signupForm.value).subscribe(() => {
      this.changeView.emit();
      this.notification.showSuccess('Inscription réussie');
    }, () => {
      this.notification.showError('L\'inscription à échoué');
    });
  }
}
