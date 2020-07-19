import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  /**
   *  导航栏功能组
   */
  navs: string[] = [
    "权限组管理",
    "地块管理",
    "楼宇管理",
  ];

  panelOpenState = true;
  
}
