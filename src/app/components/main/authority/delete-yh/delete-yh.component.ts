import { Component, OnInit,ViewChild,Inject } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { DataserviveService } from '../../../../services/dataservive.service';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-delete-yh',
  templateUrl: './delete-yh.component.html',
  styleUrls: ['./delete-yh.component.css']
})

export class DeleteYHComponent implements OnInit {

  constructor(public dialogRef:MatDialogRef<DeleteYHComponent>,@Inject(MAT_DIALOG_DATA) public data,private snackBar: MatSnackBar) {}
  
  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close();
  }
}


