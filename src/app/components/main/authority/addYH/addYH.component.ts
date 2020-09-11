import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-addYH',
  templateUrl: './addYH.component.html',
  styleUrls: ['./addYH.component.css']
})
export class AddYHComponent implements OnInit {

  // public project:Object;
  // public dialogRef:MatDialogRef<AddYHComponent>,@Inject(MAT_DIALOG_DATA) public data

  constructor(public dialogRef:MatDialogRef<AddYHComponent>,@Inject(MAT_DIALOG_DATA) public data) { }
  ngOnInit(): void {
    // this.project = this.data||{};
  }
  onNoClick(){
    this.dialogRef.close();
  }
  // tjyhxx(data){
  //   console.log(data)
  // }
}
