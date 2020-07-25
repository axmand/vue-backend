import { Injectable } from '@angular/core';
import axios from "axios";

@Injectable({
  providedIn: 'root'
})
export class DataserviveService {

  public userInfo:any;
  // content: "{"userName":"admin","token":"ba8d3af77a474d26a98509b0c6a2e0f6","groupName":"系统管理员","level":99}"

  constructor() { }

  getdata(api){
    return new Promise((resolve,reject)=>{
      axios.get(api)
      .then(function (response) {
      resolve(response)
      })
    })
  }
  postdata(api,data){
    return new Promise((resolve,reject)=>{
      axios.post(api,data)
      .then(function (response) {
      resolve(response)
      })
    })   
  }
}
