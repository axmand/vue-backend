import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Code404Component } from './code404/code404.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { UserComponent } from './user/user.component';

/**
 * @author yellow 2020/7/18
 * 第一层，主功能页面
 * -登录
 * -主页
 * 第二层
 * -主页/用户管理
 * -主页/地块管理
 * -主页/楼宇管理
 * -主页/****
 */
const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'main', component: MainComponent, children: [
      { path: 'user', component: UserComponent }
    ]
  },
  { path: '**', component: Code404Component }  // 错误页面，放在匹配最后
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    { enableTracing: true }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
