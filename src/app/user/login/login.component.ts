import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showAlert = false;
  alertMsg = 'Please wait! Logging in.';
  alertColor = 'blue';
  
  credentials = {
    email: '',
    password: ''
  }

  login() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! Logging in.';
    this.alertColor = 'blue';
  }
}
