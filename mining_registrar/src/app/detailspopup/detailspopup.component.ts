import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface Dummydata {
  message: string;
  comp_name: string;
  msg:any;
  cid: number;
  status: string;
  submit_date : string;
  for_button: string;
  feedback:any;
  feedback_msg:any;
  action:any;
  reason:any;
  ore:any;
  start_time:any;
  end_time:any;
  cord:any;
  value:any;
  volume:any;
}

@Component({
  selector: 'app-detailspopup',
  templateUrl: './detailspopup.component.html',
  styleUrls: ['./detailspopup.component.css']
})
export class DetailspopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DetailspopupComponent>,@Inject(MAT_DIALOG_DATA) public data: Dummydata) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
