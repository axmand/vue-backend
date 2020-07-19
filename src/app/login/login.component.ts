import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  userName: string;

  passWord: string;

  onLogin() {
    // 跳转到main-用户管理
    this.router.navigate(['/main/user'])
    //提示
    this.snackBar.open("登录成功", "关闭", {
      duration: 2 * 1000,
      horizontalPosition: "end",
      verticalPosition: "bottom"
    });
  }
}
