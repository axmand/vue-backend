import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { DataserviveService } from '../../../services/dataservive.service';

export interface PeriodicElement {
  floor_area:string,
  floor_height:string,
  passager_num:string,
  parking_num:string,
  rental:string,
  property_fee:string,
  vacant_area:string,
  settled:string,
  ID:number,
  name:string,
  address:string,
  street:string,
  volume:string,
}


@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css']
})
export class BuildingComponent implements OnInit {

  @ViewChild("lytable") lytable:any;
  public displayedColumns: string[] = ["ID","name","address","street","volume","floor_area","floor_height","passager_num","parking_num","rental","property_fee","vacant_area","settled","操作"];
  public dataSource: PeriodicElement[]=[];
  public LYlist:any[]=[];
  public postData = {
     userName:this.httpservice.userInfo.userName,
     token: this.httpservice.userInfo.token,
     content: ''
    }
  public content:any={type:"FeatureCollection", features:[]}
  public httpoptions={headers:new HttpHeaders({"Content-Type":"application/json"})};
// [{"type":"Feature","geometry":{"type":"Point","coordinates":[114.2401869,30.56871864]},"properties":{"name":"中海大厦","volume":"56000","floor_area":"1512.08","floor_height":"4.15","passager_num":"9","parking_num":"340","rental":"80","property_fee":"15","vacant_area":"9000","settled":"36","address":"湖北省武汉市汉阳区晴川街道知音大道257号","ID":1,"street":"晴川街道"}}]

  constructor(public http:HttpClient,public httpservice:DataserviveService) { }

  ngOnInit(): void {
    // let rootapi="http://139.129.7.130:1338/";
    // this.httpservice.getdata(rootapi+'/bms/geoprovider/LYXX').then((response:any)=>{
    //   //console.log(response);
    //   this.LYlist=JSON.parse(response.content).features;
    // })
    // let api=rootapi+'bms/geodatalyxxupdate';
    // this.httpsevice.postdata(api,this.postData).then((response)=>{
    //   console.log(response)
    // })
    //console.log(this.postData);

    // const httpoptions={headers:new HttpHeaders({"Content-Type":"application/json"})};
    // this.http.post("bms/geodatalyxxupdate",this.postData,httpoptions).subscribe((response:any)=>{
    //   console.log(response);    
    // })
    this.http.get("bms/geoprovider/LYXX").subscribe((response:any)=>{
      console.log(JSON.parse(JSON.parse(response.content)));
      if (response.status == "ok") {
          this.LYlist =(JSON.parse(JSON.parse(response.content))).features;
          console.log(this.LYlist)
          for(var i=0; i<this.LYlist.length;i++){
            console.log(this.LYlist[i]);
            this.dataSource.push(this.LYlist[i].properties);
          }
          console.log(this.dataSource)
      }     
    })
  }

  view(){
    this.lytable.renderRows();
  }
  addly(){
    this.dataSource=[];
    this.LYlist.push({"type":"Feature","geometry":{"type":"Point","coordinates":[114.2401869,30.56871864]},"properties":{"name":"中海大厦2","volume":"56000","floor_area":"1512.08","floor_height":"4.15","passager_num":"9","parking_num":"340","rental":"80","property_fee":"15","vacant_area":"9000","settled":"36","address":"湖北省武汉市汉阳区晴川街道知音大道257号","ID":1,"street":"晴川街道"}})
    this.content.features=this.LYlist
    console.log(this.content);    
    this.postData.content=JSON.stringify(this.content)
    console.log(this.postData);
    this.http.post("bms/geodatalyxxupdate",this.postData,this.httpoptions).subscribe((response:any)=>{
      console.log(response); 
      if(response.status=="ok"){
          for(var i=0; i<this.LYlist.length;i++){
            console.log(this.LYlist[i]);
            this.dataSource.push(this.LYlist[i].properties);
          }
          console.log(this.dataSource)
          this.lytable.renderRows();       
      }
    })
    
  }
  ngAfterViewInit(){ 
  }

}
