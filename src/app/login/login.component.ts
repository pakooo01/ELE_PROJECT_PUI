import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news/news.service';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../services/login/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../interface/interface.module';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, NgFor,NgClass, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoggedIn: boolean = false;
  loggedInUser: string = ''; 
  errorMessage: string = '';

  constructor(
    private newsService: NewsService, 
    private router: Router, 
    private fb: FormBuilder,
    private loginService: LoginService,
  ){
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;
  
      this.loginService.login(username, password).subscribe({
        next: (response) => {
          console.log('Login success', response);
          this.newsService.setUserApiKey(response.apikey);
          this.isLoggedIn = true;
          this.loggedInUser = response.username;
          this.errorMessage = ''; // Reset errore in caso di successo
          this.router.navigate(['/articles']);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = error.message; // Mostra il messaggio di errore
          this.isLoggedIn = false;
        }
      });
    } else {
      this.errorMessage = 'Please enter both username and password.';
    }
  }

  accessWithoutLogin(){
    this.router.navigate(['/articles']);
  }
}
