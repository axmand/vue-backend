import { Component, OnInit,ViewChild,Inject } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { DataserviveService } from '../../../services/dataservive.service';
import { MatDialog,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddYHComponent } from './addYH/addYH.component';
import {DeleteYHComponent} from'./delete-yh/delete-yh.component';
import {OpenAPIComponent} from'./open-api/open-api.component';

export interface PeriodicElement {
  apiList:[];
  date:string;
  description:string;
  groupName:string;
  level:number;
  objectId:string;
  time:string;
}

export interface objectId {

}

@Component({
  selector: 'app-authority',
  templateUrl: './authority.component.html',
  styleUrls: ['./authority.component.css']
})

export class AuthorityComponent implements OnInit {

  public apiList:[];
  public date:string="";
  public description:string="";
  public groupName:string="";
  public level:number;
  public objectId:string="";
  public time:string="";


  @ViewChild("yhtable") yhtable:any;
  public displayedColumns: string[] = ["groupName","level","description","操作"];
  public dataSource: PeriodicElement[]=[];
  public YHlist:any[]=[];

  constructor(public http:HttpClient,public httpservice:DataserviveService,public dialog: MatDialog,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.http.get("cms/getgrouplist/"+this.httpservice.userInfo.userName+ '/'+this.httpservice.userInfo.token).subscribe((response:any)=>{
      if (response.status == "ok") {
          this.YHlist =JSON.parse(response.content);
          console.log(this.YHlist)
          for(var i=0; i<this.YHlist.length;i++){
            this.dataSource.push(this.YHlist[i]);
          }
          console.log(this.yhtable)
          this.yhtable.renderRows();     
      }     
    })
  }

  addyh() {
    const dialogRef = this.dialog.open(AddYHComponent,{data:{apiList:this.apiList,date:this.date,description:this.description,groupName:this.groupName,level:this.level,objectId:this.objectId,time:this.time}});
    dialogRef.afterClosed().subscribe(result => {
      this.http.get("cms/creategroup/"+this.httpservice.userInfo.userName+ '/'+this.httpservice.userInfo.token +'/'+ result.groupName + '/'+result.description+ '/'+result.level)
      .subscribe((response:any)=>{
        if (response.code == "400") {
          console.log('successs')
          this.snackBar.open("添加成功", "关闭", {
            duration: 2 * 1000,
            horizontalPosition: "end",
            verticalPosition: "bottom"
          });
          this.http.get("cms/getgrouplist/"+this.httpservice.userInfo.userName+ '/'+this.httpservice.userInfo.token).subscribe((response:any)=>{
            if (response.status == "ok") {
                this.YHlist = [];
                this.dataSource = [];
                this.YHlist =JSON.parse(response.content);
                console.log(this.YHlist)
                for(var i=0; i<this.YHlist.length;i++){
                  this.dataSource.push(this.YHlist[i]);
                }
                console.log(this.dataSource)
                this.yhtable.renderRows();     
            }     
          })
        }     
        else{
          console.log('failed')
          this.snackBar.open(response.content, "错误", {
            duration: 2 * 1000,
            horizontalPosition: "end",
            verticalPosition: "bottom"
          });
        }
      })
    });
    this.yhtable.renderRows(); 
  }

  deleteyh(objectId){
    console.log(objectId)
    const dialogRef= this.dialog.open(DeleteYHComponent,{data:objectId})
    dialogRef.afterClosed().subscribe(result => {
      this.http.get("cms/deletegroup/"+this.httpservice.userInfo.userName+ '/'+this.httpservice.userInfo.token +'/'+ result)
      .subscribe((response:any)=>{
        if (response.code == "200") {
          console.log('successs')
          this.snackBar.open("删除成功", "关闭", {
            duration: 2 * 1000,
            horizontalPosition: "end",
            verticalPosition: "bottom"
          });
          this.http.get("cms/getgrouplist/"+this.httpservice.userInfo.userName+ '/'+this.httpservice.userInfo.token).subscribe((response:any)=>{
            if (response.status == "ok") {
                this.YHlist = [];
                this.dataSource = [];
                this.YHlist =JSON.parse(response.content);
                for(var i=0; i<this.YHlist.length;i++){
                  this.dataSource.push(this.YHlist[i]);
                }
                console.log(this.dataSource)
                this.yhtable.renderRows();     
            }     
          })
        }     
        else{
          console.log('failed')
        }
      })
    })
  }

  openAPI(objectId){
    console.log(objectId)
    const dialogRef= this.dialog.open(OpenAPIComponent,{data:objectId})
    dialogRef.afterClosed().subscribe(result => {
    })
  }
}





