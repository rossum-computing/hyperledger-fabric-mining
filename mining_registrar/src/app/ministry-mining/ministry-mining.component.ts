import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetailspopupComponent } from '../detailspopup/detailspopup.component';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { merge, Observable, of as observableOf } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ministry-mining',
  templateUrl: './ministry-mining.component.html',
  styleUrls: ['./ministry-mining.component.css']
})
export class MinistryMiningComponent implements OnInit {
  constructor(public dialog: MatDialog, private http: HttpClient, public router: Router) { }
  server_url = environment.server_url
  selected = true;
  selectedAction = true;
  result: any;
  dataSource: any;
  selectHistory = false;
  display: string;
  feedback: any;
  flag: any;

  ORG1_TOKEN: String;
  ORG2_TOKEN: String;
  ORG3_TOKEN: String;

  selectRow(row) {
    var tuplecord = row.Record['cord'];
    var ex = /\[/gi;
    var cord = tuplecord.replace(ex, "(");
    var ex = /\]/gi;
    tuplecord = cord.replace(ex, ")");
    const dialogRef = this.dialog.open(DetailspopupComponent, {
      width: '500px',
      data: {
        submit_date: row.Record['submiy_date'], cid: row['Key'], comp_name: row.Record['company_name'], status: row.Record['status'], ore: row.Record['ore'], start_time: row.Record['start_time'], end_time: row.Record['end_time'],
        cord: [tuplecord], volume: row.Record['volume'], value: row.Record['value'], reason: row.Record['msg']
      }
    });
  }
  /*onTimeOut(){
    this.getData("http://183.82.112.165:8080/api/get/claims/pending/", ['pending']);
    setTimeout(()=>{
      this.onTimeOut();
    }, 10000);
  }*/
  tabClick(event: MatTabChangeEvent) {
    if (event.index == 0) {
      console.log("tab 1")
      this.getData(this.server_url, ['pending']);
    }
    if (event.index == 1) {
      console.log('tab 2')
      this.getData(this.server_url, ['approved', 'rejected']);
    }
  }

  sortData(event: any) {
    return 0;
  }

  onApprove(row: any, action: any) {
    const dialogRef = this.dialog.open(DetailspopupComponent, {
      width: '400px',
      data: { flag: 'true', action: action }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed'); this.flag = result;
      console.log(this.flag);
      if (this.flag == true) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': "Bearer " + this.ORG2_TOKEN });
        let options = { headers: headers };
        var body = JSON.stringify({
          "peers": ["peer0.org1.example.com", "peer0.org2.example.com", "peer0.org3.example.com"],
          "fcn": "approveClaim",
          "args": [row['Key'], "Srinivasulu"]
        });
        console.log(body);
        var url = this.server_url;
        this.http.post(url, body, options).subscribe(data => {
          if (data['success']) {
            const dialogRef = this.dialog.open(DetailspopupComponent, { width: '350px', data: { "message": "Claim approved successfully." } });
          } else {
            const dialogRef = this.dialog.open(DetailspopupComponent, { width: '350px', data: { "message": data['message'] } });
          }
          console.log(data);
          this.selectedAction = true;
          this.getData(this.server_url, ['pending']);
        },
          error => {
            console.log(error);
            if (error.status == 401) {
              localStorage.clear();
              this.router.navigate(['/homepage']);
            };
          });
      }
    });
  }

  onReject(row: any, action: any) {
    const dialogRef = this.dialog.open(DetailspopupComponent, {
      width: '400px',
      data: { flag: 'true', action: action }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.flag = result;
      if (this.flag == true) {
        const dialogRef = this.dialog.open(DetailspopupComponent, { width: '450px', data: { feedback: "hihi" } });
        dialogRef.afterClosed().subscribe(result => {
          this.feedback = result
          if (this.feedback) {
            var data = { cid: row['cid'], approver_name: "Srinivasulu", msg: this.feedback, value: row['value'] };
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': "Bearer " + this.ORG2_TOKEN });
            let options = { headers: headers };
            var body = JSON.stringify({
              "peers": ["peer0.org1.example.com", "peer0.org2.example.com", "peer0.org3.example.com"],
              "fcn": "rejectClaim",
              "args": [row['Key'], "Srinivasulu", this.feedback]
            });
            var url = this.server_url;
            this.http.post(url, body, options).subscribe(data => {
              if (data['success']) {
                const dialogRef = this.dialog.open(DetailspopupComponent, { width: '350px', data: { "message": "Claim rejected successfully." } });
              } else {
                const dialogRef = this.dialog.open(DetailspopupComponent, { width: '350px', data: { "message": data['message'] } });
              }
              console.log(data);
              this.selectedAction = true;
              this.getData(this.server_url, ['pending']);
            },
            error => { 
              console.log(error);
              if (error.status == 401) {
                localStorage.clear();
                this.router.navigate(['/homepage']);
              };
             });
          }
        });
      }
    });
  }

  onHistory() {
    this.selectHistory = true;
  }

  onBack() {
    this.selectHistory = false;
    this.getData(this.server_url, ['pending']);
  }

  getData(url: any, status_array: any) {
    this.displayedColumns = ['cid', 'comp_name', 'status', 'submit_date', 'for_button', 'approve', 'reject'];
    var body = JSON.stringify({
      "peers": ["peer0.org1.example.com", "peer0.org2.example.com", "peer0.org3.example.com"],
      "fcn": "queryAllClaims",
      "args": []
    })
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', "authorization": "Bearer " + this.ORG2_TOKEN });
    this.http.post(url, body, { headers: headers }).subscribe(
      data => {
        if (data['success']) {
          this.result = JSON.parse(data['message']);
          console.log(this.result);
          this.dataSource = new MatTableDataSource(this.result.filter(claim => status_array.indexOf(claim.Record.status) > -1));
          this.dataSource.sort = this.sort; this.dataSource.paginator = this.paginator;
        } else {
          const dialogRef = this.dialog.open(DetailspopupComponent, { width: '350px', data: { "message": data['message'] } });
        }
      },
      error => { 
        console.log(error); 
        if (error.status == 401) {
          localStorage.clear();
          this.router.navigate(['/homepage']);
        };
      }
    );
  }

  displayedColumns: string[] = ['cid', 'comp_name', 'status', 'submit_date', 'for_button', 'approve', 'reject'];
  displayedColumnslimited: string[] = ['cid', 'comp_name', 'request_type', 'status', 'submit_date', 'ore'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    //this.onTimeOut();
    this.ORG1_TOKEN = localStorage.getItem('ORG1_TOKEN');
    this.ORG2_TOKEN = localStorage.getItem('ORG2_TOKEN');
    this.ORG3_TOKEN = localStorage.getItem('ORG3_TOKEN');
    this.getData(this.server_url, ['pending']);
  };

}
