import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DataserviveService } from '../../services/dataservive.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private snackBar: MatSnackBar, public http: HttpClient, public httpservice: DataserviveService) { }

  ngOnInit(): void {
  }

  userName: string;

  passWord: string;

  onLogin() {
    let api = "http://139.129.7.130:1338/cms/login";
    const httpoptions = { headers: new HttpHeaders({ "Content-Type": "application/json" }) };
    this.http.post("cms/login", { "userName": this.userName, "userPwd": this.passWord }, httpoptions).subscribe((response: any) => {
      if (response.status == "ok") {
        this.httpservice.userInfo = JSON.parse(response.content);
        // 跳转到main-用户管理
        this.router.navigate(['/main'])
        //提示
        this.snackBar.open("登录成功", "关闭", {
          duration: 2 * 1000,
          horizontalPosition: "end",
          verticalPosition: "bottom"
        });
      } else {
        this.snackBar.open(response.content, "确定", {
          duration: 2 * 1000,
          horizontalPosition: "end",
          verticalPosition: "bottom"
        });
      }
    })
  }

}
