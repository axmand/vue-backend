import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { DataserviveService } from '../../../services/dataservive.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css']
})
export class BuildingComponent implements OnInit {

  public displayedColumns: string[] = ['position', 'name', 'weight', 'symbol',"操作"];
  public dataSource = ELEMENT_DATA;
  public LYlist:any[]=[];
  public postData = {
     userName:this.httpservice.userInfo.userName,
     token: this.httpservice.userInfo.token,
     content: '{type:"FeatureCollection", features: [{type:"Feature",geometry:{type:"Point",coordinates:[114.2401869,30.56871864]},properties:{x:114.2401869,y:30.56871864,name:"中海大厦",volume:"56000",floor_num:"34",Standard_f:"1512.08",net_height:"4.15",passenger_:"9",parking_nu:"340",monthly_re:"80",property_m:"15",vacant_are:"9000",settled_en:36,address:"湖北省武汉市汉阳区晴川街道知音大道257号",id:1,street:"晴川街道",street1:6,volumn1:5,vacant1:3}}]}'
    }

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
    const httpoptions={headers:new HttpHeaders({"Content-Type":"application/json"})};
    this.http.post("bms/geodatalyxxupdate",this.postData,httpoptions).subscribe((response:any)=>{
      console.log(response);
      // if (response.status == "ok") {
      //     this.httpservice.userInfo = JSON.parse(response.content);
      // }     
    })
    this.http.get("bms/geoprovider/LYXX").subscribe((response:any)=>{
      console.log(JSON.parse(response.content));
      // console.log(JSON.parse(response.content).features);
      // if (response.status == "ok") {
      //     this.httpservice.userInfo = JSON.parse(response.content);
      // }     
    })
  }

}
