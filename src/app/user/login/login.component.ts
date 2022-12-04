import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showAlert = false;
  alertMsg = 'Please wait! Logging in.';
  alertColor = 'blue';
  inSubmission = false;
  
  credentials = {
    email: '',
    password: ''
  }

  constructor(
    private auth: AngularFireAuth
  ) {}

  async login() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! Logging in.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );

    }catch(err) {
      this.alertMsg = 'An unexpected error occured. please try again!';
      this.alertColor = 'red';

      console.error(err);

      return
    }finally {
      this.inSubmission = false;
    }

    this.alertMsg = 'Success you are logged in!';
    this.alertColor = 'green';
  }
}
