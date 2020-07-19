import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/**
 * component
 */
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { UserComponent } from './components/user/user.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    { enableTracing: true }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
