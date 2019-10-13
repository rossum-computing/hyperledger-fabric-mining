import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetailspopupComponent } from '../detailspopup/detailspopup.component';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mining-company',
  templateUrl: './mining-company.component.html',
  styleUrls: ['./mining-company.component.css']
})
export class MiningCompanyComponent implements OnInit {

  constructor(public dialog: MatDialog, private router: Router, private http: HttpClient, private formBuilder: FormBuilder) { }
  server_url = environment.server_url
  result: any;
  dataSource: any;
  transferRequest = false;
  list: any;
  transferRequestForm: FormGroup;
  submitted = false;
  flag: any;
  cids: any;

  ORG1_TOKEN: String;
  ORG2_TOKEN: String;
  ORG3_TOKEN: String;

  companies = ["Hindustan Zinc", "Jiangxi Copper", "VPR Mining", "Uralkaliy", "Vedanta", "NMDC", "Maithan Alloys", "Deccan Gold", "Coal India",
    "Indsil Hydro", "Auroma Coke Limited", "MOIL", "Ashapura Mine",
    "Ferro Alloys", "Mount Gibson Mining Iron Ltd", "BC Iron Limited"
    , "Atlas Iron", "Arrium Mining", "Cliff Natural Resources ",
    "Fortescue Metals Group", "BHP Billiton", "Vale", "Rio Tinto",
    "Barrick Gold", "Polyus"]
  transferReq() {
    this.transferRequest = true;
    this.getData(this.server_url);
  }
  /*  onTimeOut(){
      this.getData("http://183.82.112.165:8080/api/get/claims/latest/");
      setTimeout(()=>{
        this.onTimeOut();
      }, 1000000);
    }*/
  onBack() {
    this.transferRequest = false;
    // this.getData(this.server_url);
  }
  selectRow(row: any) {
    var tuplecord = row.Record['cord'];
    var ex = /\[/gi;
    var cord = tuplecord.replace(ex, "(");
    var ex = /\]/gi;
    tuplecord = cord.replace(ex, ")");
    const dialogRef = this.dialog.open(DetailspopupComponent, {
      width: '500px',
      data: {
        submit_date: row.Record['submiy_date'], cid: row['Key'], comp_name: row.Record['company_name'], status: row.Record['status'], ore: row.Record['ore'], start_time: row.Record['start_time'], end_time: row.Record['end_time'], cord: [tuplecord], value: row.Record['value'],
        volume: row.Record['volume']
      }
    });
  }
  getData(url: any) {
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
          this.cids = JSON.parse(this.result.message);
          console.log(JSON.parse(this.result.message));
          this.dataSource = new MatTableDataSource(JSON.parse(this.result.message));
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
  }
  displayedColumns: string[] = ['cid', 'comp_name', 'request_type', 'status', 'submit_date', 'ore'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.ORG1_TOKEN = localStorage.getItem('ORG1_TOKEN');
    this.ORG2_TOKEN = localStorage.getItem('ORG2_TOKEN');
    this.ORG3_TOKEN = localStorage.getItem('ORG3_TOKEN');

    //this.onTimeOut();
    //  this.getData("http://183.82.112.165:8080/api/get/claims/latest/");
    this.transferRequestForm = this.formBuilder.group({
      comp_name: ['', Validators.required],
      value: ['', Validators.required],
      cid: ['', Validators.required]
      //email: ['', [Validators.required, Validators.email]],
      //password: ['', [Validators.required, Validators.minLength(6)]]
    })
    //this.http.get("http://183.82.112.165:8080/api/get/dummies/cid/").subscribe(data => {this.cids=data['result'];console.log(data['result']);},

    this.getData(this.server_url);

  }

  get f() { return this.transferRequestForm.controls; }

  onTransfer() {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', "authorization": "Bearer " + this.ORG1_TOKEN });
    let options = { headers: headers };
    var body = JSON.stringify({
      "peers": ["peer0.org1.example.com", "peer0.org2.example.com", "peer0.org3.example.com"],
      "fcn": "transferClaim",
      "args": [this.transferRequestForm.value.cid, this.transferRequestForm.value.comp_name, String(this.transferRequestForm.value.value)]
    });
    console.log(body)
    if (this.transferRequestForm.valid) {
      const dialogRef = this.dialog.open(DetailspopupComponent, {
        width: '400px',
        data: { flag: 'true', action: 'transfer' }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.flag = result;
        if (this.flag == true) {
          console.log(body);
          var url = this.server_url;
          this.http.post(url, body, options).subscribe(data => {
            this.result = data;
            console.log(data);
            if (this.result['success']) {
              const dialogRef = this.dialog.open(DetailspopupComponent, {
                width: '400px',
                data: { "message": "Trensfer request success" }
              });
              //this.router.navigate(['mining-company']);
            } else {
              const dialogRef = this.dialog.open(DetailspopupComponent, {
                width: '400px',
                data: { "message": this.result['message'] }
              });
            }
          }, error => { 
            console.log(error);
            if (error.status == 401) {
              localStorage.clear();
              this.router.navigate(['/homepage']);
            }; 
          });
          this.getData(this.server_url);
          this.transferRequest = false;
        }
      });
    }
    this.submitted = true;
    if (this.transferRequestForm.invalid) {
      return;
    }
  }

}
