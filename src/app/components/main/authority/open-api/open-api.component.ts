import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataserviveService } from '../../../../services/dataservive.service';


export interface PeriodicElement {
  id:number;
  name:string;
  description:string;
}

@Component({
  selector: 'app-open-api',
  templateUrl: './open-api.component.html',
  styleUrls: ['./open-api.component.css']
})

export class OpenAPIComponent implements OnInit {

  public description:string="";
  public name:string="";
  public id:number;
  public json:JSON;



  @ViewChild("qxtable") qxtable:any;
  public displayedColumns: string[] = ["description","操作"];
  public dataSource: PeriodicElement[]=[];
  public QXlist:any[]=[];

  constructor(public dialogRef:MatDialogRef<OpenAPIComponent>,@Inject(MAT_DIALOG_DATA) public data,public http:HttpClient,public httpservice:DataserviveService,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.http.get("/cms/getconfigureableapilist").subscribe((response:any)=>{
      if (response.status == "ok") {
        this.QXlist =JSON.parse(response.content);
        var i=0;
        for(var key in this.QXlist){
          var id = i + 1;
          var name = key; 
          var description = this.QXlist[key];
          var json : PeriodicElement[]=[];
          json[i] = <PeriodicElement>{id:id,name:name,description:description};
          this.dataSource.push(json[i]);
          i++;
        }
        console.log(this.dataSource)
        this.qxtable.renderRows();     
      }     
    })
  }

  APIAuthorize(name,id){
    console.log(name,id)
    this.http.get("cms/authorizegroupapi/"+this.httpservice.userInfo.userName+ '/'+this.httpservice.userInfo.token +'/'+ id+'/'+name)
    .subscribe((response:any)=>{
      if (response.code == "200") {
        console.log('successs')
        this.snackBar.open("授权成功", "关闭", {
          duration: 2 * 1000,
          horizontalPosition: "end",
          verticalPosition: "bottom"
        });
      }     
      else{
        console.log('failed')
        this.snackBar.open("授权失败", "关闭", {
          duration: 2 * 1000,
          horizontalPosition: "end",
          verticalPosition: "bottom"
        });
      }
    })
  }

  APIWithdraw(name,id){
    console.log(name,id)
    this.http.get("cms/withdrawgroupapi/"+this.httpservice.userInfo.userName+ '/'+this.httpservice.userInfo.token +'/'+ id+'/'+name)
    .subscribe((response:any)=>{
      if (response.code == "200") {
        console.log('successs')
        this.snackBar.open("权限收回成功", "关闭", {
          duration: 2 * 1000,
          horizontalPosition: "end",
          verticalPosition: "bottom"
        });
      }     
      else{
        console.log('failed')
        this.snackBar.open("权限收回失败", "关闭", {
          duration: 2 * 1000,
          horizontalPosition: "end",
          verticalPosition: "bottom"
        });
      }
    })
  }

}
