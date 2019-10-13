import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetailspopupComponent } from '../detailspopup/detailspopup.component';
import { MatTabChangeEvent } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ministry-land-agri',
  templateUrl: './ministry-land-agri.component.html',
  styleUrls: ['./ministry-land-agri.component.css']
})
export class MinistryLandAgriComponent implements OnInit {

  constructor(public dialog: MatDialog, private http: HttpClient, public router: Router) { }
  server_url = environment.server_url
  selected = true;
  selectedAction = true;
  result: any;
  dataSource: any;
  selectHistory = false;
  display: string;
  flag: any;
  feedback: any;

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
      width: '450px',
      data: {
        submit_date: row.Record['submiy_date'], cid: row['Key'], comp_name: row.Record['company_name'], status: row.Record['status'],
        ore: row.Record['ore'], start_time: row.Record['start_time'], end_time: row.Record['end_time'], cord: [tuplecord],
        value: row.Record['value'], volume: row.Record['volume']
      }
    });
  }
  tabClick(event: MatTabChangeEvent) {
    if (event.index == 1) {
      this.getData(this.server_url, ['approved', 'rejected'], ['transfer']);
    }
    if (event.index == 0) {
      this.getData(this.server_url, ['pending'], ['transfer']);
    }
  }
  /*onTimeOut(){
    this.getData("http://183.82.112.165:8080/api/get/claims/transfer/", ['pending']);
    setTimeout(()=>{
      this.onTimeOut();
    }, 10000);
  }*/
  onApprove(row: any, action: any) {
    const dialogRef = this.dialog.open(DetailspopupComponent, {
      width: '400px',
      data: { flag: 'true', action: action }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.flag = result;
      console.log(this.flag);
      if (this.flag == true) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': "Bearer " + this.ORG3_TOKEN });
        let options = { headers: headers };
        var body = JSON.stringify({
          "peers": ["peer0.org1.example.com", "peer0.org2.example.com", "peer0.org3.example.com"],
          "fcn": "transferClaimApprove",
          "args": [row['Key'], "Srinivasulu", String(row.Record['value'])]
        });
        console.log(body)
        var url = this.server_url;
        this.http.post(url, body, options).subscribe(data => {
          if (data['success']) {
            const dialogRef = this.dialog.open(DetailspopupComponent, { width: '350px', data: { "message": "Transfer claim approved successfully" } });
          } else {
            const dialogRef = this.dialog.open(DetailspopupComponent, { width: '350px', data: { "message": data['message'] } });
          }
          console.log(data);
          this.getData(this.server_url, ['pending'], ['transfer']);
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
          this.feedback = result;
          if (this.feedback) {
            console.log(this.feedback)
            let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': "Bearer " + this.ORG3_TOKEN });
            let options = { headers: headers };
            var body = JSON.stringify({
              "peers": ["peer0.org1.example.com", "peer0.org2.example.com", "peer0.org3.example.com"],
              "fcn": "transferClaimReject",
              "args": [row['Key'], "Srinivasulu", this.feedback]
            });
            var url = this.server_url;
            this.http.post(url, body, options).subscribe(data => {
              if (data['success']) {
                const dialogRef = this.dialog.open(DetailspopupComponent, { width: '350px', data: { "message": "Transfer claim rejected successfully" } });
              } else {
                const dialogRef = this.dialog.open(DetailspopupComponent, { width: '350px', data: { "message": data['message'] } });
              }
              console.log(data);
              this.selectedAction = true;
              this.getData(this.server_url, ['pending'], ['transfer']);
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
  sortData(event: any) {
    return 0;
  }
  onHistory() {
    this.selectHistory = true;
    this.getData(this.server_url, ['approved', 'rejected'], ['transfer']);
  }
  onBack() {
    this.selectHistory = false;
    this.getData(this.server_url, ['pending'], ['transfer']);
  }
  getData(url: any, status_array: any, request_array: any) {

    let options = { headers: { 'Content-Type': 'application/json', 'authorization': "Bearer " + this.ORG1_TOKEN } };
    var body = JSON.stringify({
      "peers": ["peer0.org1.example.com", "peer0.org2.example.com", "peer0.org3.example.com"],
      "fcn": "queryAllClaims",
      "args": []
    });

    this.http.post(url, body, options).subscribe(data => {
      if (data['success']) {
        this.result = data;
        if (this.result) {
          console.log(JSON.parse(this.result.message));
          this.result = JSON.parse(this.result.message)
          this.result = this.result.filter(claim => status_array.indexOf(claim.Record.status) > -1);
          this.result = this.result.filter(claim => request_array.indexOf(claim.Record.request_type) > -1);
          this.dataSource = new MatTableDataSource(this.result);
          this.dataSource.sort = this.sort; this.dataSource.paginator = this.paginator;
        }
      } else {
        const dialogRef = this.dialog.open(DetailspopupComponent, { width: '350px', data: { "message": data['message'] } });
      }

    }, error => { 
      console.log(error);
      if (error.status == 401) {
        localStorage.clear();
        this.router.navigate(['/homepage']);
      }; 
    });

    //this.displayedColumns = ['cid','comp_name','status','submit_date','for_button','approve','reject'];
  }
  displayedColumns: string[] = ['cid', 'comp_name', 'status', 'submit_date', 'for_button', 'approve', 'reject'];
  displayedColumnslimited: string[] = ['cid', 'comp_name', 'request_type', 'status', 'submit_date', 'for_button'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit() {

    this.ORG1_TOKEN = localStorage.getItem('ORG1_TOKEN');
    this.ORG2_TOKEN = localStorage.getItem('ORG2_TOKEN');
    this.ORG3_TOKEN = localStorage.getItem('ORG3_TOKEN');
    //this.onTimeOut();
    this.getData(this.server_url, ['pending'], ['transfer']);
  };

}
