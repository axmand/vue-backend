import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-addly',
  templateUrl: './addly.component.html',
  styleUrls: ['./addly.component.css']
})
export class AddlyComponent implements OnInit {

  // public project:Object;
  // public dialogRef:MatDialogRef<AddlyComponent>,@Inject(MAT_DIALOG_DATA) public data

  constructor(public dialogRef:MatDialogRef<AddlyComponent>,@Inject(MAT_DIALOG_DATA) public data) { }
  ngOnInit(): void {
    // this.project = this.data||{};
  }
  onNoClick(){
    this.dialogRef.close();
  }

}
