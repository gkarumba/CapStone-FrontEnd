import { Component, OnInit, Input } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Router } from '@angular/router';
import { AnswerCountValidator } from 'survey-angular';
import { Answers } from '../../../models/answers';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit, OnDestroy {
  @Input() answers: Answers;
  public loginUserData = { email: '', password: '' };
  user_id;
  user_url = "http://localhost:8000/api/users/";
  user: any = { groups: '' }
  isLoading = false;
  public role = "";
  constructor(private _auth: AuthService,
    private _router: Router,
    private http: HttpClient) {
    this.role = "";
  }

  ngOnInit() {
    this.role = "";
  }
  ngOnDestroy() {
    this.role = "";
  }
  loginUser() {
    this.isLoading = true;
    // console.log(this.loginUserData);
    this.role = "";
    this._auth.loginUser(this.loginUserData)
      .subscribe(
        res => {
          console.log(res)
          localStorage.setItem('token', res.token);
          this.user_id = res.id;
          console.log(res.id)
          this._auth.saveUserId(this.user_id);
          this._auth.getRole(this.user_id).subscribe(user => {
            // console.log(user.groups[0].name)
            this.role = "";
            console.log(user)
            this.role = user['groups'][0].name;
            console.log("this is the role returned" + this.role)

            if (user['groups'][0].name == "Scripter") {
              console.log("redirect to scripter")
              // console.log(this.role);
              this._router.navigate(['surveys']);
            } else if (user['groups'][0].name == "Respondent") {
              this._router.navigate(['viewsurvey']);
            } else if (user['groups'][0].name == "Administrator") {
              this._router.navigate(['admin']);
            } else {
              this._router.navigate(['']);
            }

          });



        },
        err => console.log(err)
      );
  }
  resetRole() {
    this.role = "Respondent";
  }
}


