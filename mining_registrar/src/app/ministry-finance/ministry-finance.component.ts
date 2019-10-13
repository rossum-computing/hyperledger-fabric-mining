import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetailspopupComponent } from '../detailspopup/detailspopup.component';

import { MatTabChangeEvent } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ministry-finance',
  templateUrl: './ministry-finance.component.html',
  styleUrls: ['./ministry-finance.component.css']
})
export class MinistryFinanceComponent implements OnInit {

  constructor(public dialog: MatDialog, private http: HttpClient, public router: Router) { }
  server_url = environment.server_url

  selected = true;
  result: any;
  dataSource: any;
  value: any;
  i: any;
  j: any;
  ores: Array<any> = ['ALL', 'GOLD', 'DIAMONDS', 'COAL', 'SILVER', 'IRON', 'BAXITE'];
  total_year: any;
  total_now: any;
  total_value: any;
  dataSourceRevenue: any;

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
        submit_date: row.Record['submiy_date'], cid: row['Key'], comp_name: row.Record['company_name'], status: row.Record['status'], ore: row.Record['ore'], 
        start_time: row.Record['start_time'], end_time: row.Record['end_time'], cord: [tuplecord], value: row.Record['value'], reason: row.Record['msg'],
        volume: row.Record['volume']
      }
    });
  }

  onYear(event: any) {
    // this.getDataRevenue("http://183.82.112.165:8080/api/get/revenue/" + event + "/");
  }

  years = ['ALL', 'EXPIRED', 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

  onFilterData(year: any, ore: any) {
    //console.log(this.i);
    if (this.i == 'ALL' || this.i == 'EXPIRED') {
      this.i = this.i.toLowerCase();
      console.log(this.i)
    }
    if ((this.j == null || this.j == "ALL") && (this.i == "all" || this.i == null)) {
      // this.getDataRevenue("http://183.82.112.165:8080/api/get/revenue/live/");
      console.log("1");
    }
    else if ((this.i == null || this.i == "all") && (this.j != "ALL" && this.j != null)) {
      // this.getDataRevenue("http://183.82.112.165:8080/api/get/revenue/live/" + this.j + "/");
      console.log("2");
    }
    else if ((this.i != null || this.i != "all") && (this.j != null && this.j != "ALL")) {
      // this.getDataRevenue("http://183.82.112.165:8080/api/get/revenue/" + this.i + "/" + this.j + "/");
      console.log("3");
    }
    else if ((this.i != null || this.i != "all") && (this.j == null || this.j == "ALL")) {
      // this.getDataRevenue("http://183.82.112.165:8080/api/get/revenue/" + this.i + "/");
      console.log("4");
    }
  }
  /*onTimeOut(){
    this.getData("http://183.82.112.165:8080/api/get/claims/history/");
    setTimeout(()=>{
      this.onTimeOut();
    }, 10000);
  }*/

  sortData(event: any) {

  }

  onData(value: any) {
    console.log(value);
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  onCid(value: any) {
    console.log(value);
    //this.getData("http://183.82.112.165:8080/api/get/claims/latest/");
  }

  tabClick(event: MatTabChangeEvent) {
    if (event.index == 1) {
      this.getData(this.server_url, ['pending', 'approved']);
    }
    if (event.index == 0) {
      // this.getDataRevenue("http://183.82.112.165:8080/api/get/revenue/live/");
    }
  }

  getData(url: any, status_array: any) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', "authorization": "Bearer " + this.ORG2_TOKEN });
    var body = JSON.stringify({
      "peers": ["peer0.org1.example.com", "peer0.org2.example.com", "peer0.org3.example.com"],
      "fcn": "queryAllClaims",
      "args": []
    })

    this.http.post(url, body, { headers: headers }).subscribe(data => {
      if (data['success']) {
        this.result = JSON.parse(data['message']);
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
       
    });
  }

  // getDataRevenue(url :any){
  //   this.http.get(url).subscribe(data => {this.result=data;console.log(this.result['result']);
  //   this.dataSourceRevenue = new MatTableDataSource(this.result['result']);this.dataSourceRevenue.sort = this.sort;this.total_value=this.dataSourceRevenue.data.map(result => result.value_total).reduce((acc, value) => acc + parseInt(value), 0);
  //   this.total_year=this.dataSourceRevenue.data.map(result => result.value_year).reduce((acc, value) => acc + parseInt(value), 0);
  //   this.total_now=this.dataSourceRevenue.data.map(result => result.value_now).reduce((acc, value) => acc + parseInt(value), 0);},
  //   error => {alert("Error");console.log("error ::::")});
  //   return ;
  // }

  getDataRevenue(url: any, status_array: any) {
    // this.displayedColumns = ['cid', 'comp_name', 'status', 'submit_date', 'for_button', 'approve', 'reject'];
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
          this.result = this.result.filter(claim => status_array.indexOf(claim.Record.status) > -1);
          for (let i in this.result) {
            var revenue = this.calculateRevenue(0, true, this.result[i].Record['start_time'], this.result[i].Record['end_time'],
              this.result[i].Record['value'], this.result[i].Record['volume'])
            this.result[i].Record["value_now"] = revenue[0];
            this.result[i].Record["value_total"] = revenue[1];
            this.result[i].Record["value_year"] = revenue[2];
            this.result[i].Record["days"] = revenue[3];
          }

          this.dataSourceRevenue = new MatTableDataSource(this.result);
          this.dataSourceRevenue.sort = this.sort; this.dataSourceRevenue.paginator = this.paginator;
          this.total_value = this.dataSourceRevenue.data.map(result => result.Record.value_total).reduce((acc, value) => acc + parseInt(value), 0);
          this.total_year = this.dataSourceRevenue.data.map(result => result.Record.value_year).reduce((acc, value) => acc + parseInt(value), 0);
          this.total_now = this.dataSourceRevenue.data.map(result => result.Record.value_now).reduce((acc, value) => acc + parseInt(value), 0);
          console.log(this.total_value, this.total_year, this.total_now)
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

  displayedColumns: string[] = ['cid', 'comp_name', 'status', 'submit_date', 'for_button'];
  displayedColumnsFooter: string[] = ['value_now', 'value_year', 'value_total'];
  displayedColumnsRevenue: string[] = ['cid', 'comp_name', 'ore', 'start_time', 'end_time', 'value', 'volume', 'days', 'value_year', 'value_total']; //'value_now',

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {

    this.ORG1_TOKEN = localStorage.getItem('ORG1_TOKEN');
    this.ORG2_TOKEN = localStorage.getItem('ORG2_TOKEN');
    this.ORG3_TOKEN = localStorage.getItem('ORG3_TOKEN');

    this.getDataRevenue(this.server_url, ['approved']);

  }

  calculateRevenue(_year = 0, _str = false, ...args: any[]) {
    var start_time = args[0];
    var start_date = start_time;
    var end_time = args[1];
    var end_date = end_time;

    console.log(start_date, end_date);

    var value = args[2]; var volume = args[3]; var _year = Number(_year)
    _str = _str // if _str is True values are returned as strings and value_now is only returned if +ve else as "0"
    var now_date = new Date(); // date today
    var last_date = new Date((new Date()).getFullYear(), 12 - 1, 31);
    // console.log(last_date)
    // # last date in current year
    var first_date = new Date((new Date()).getFullYear(), 1 - 1, 1);
    // console.log(first_date);
    // # first date in current year
    var delta1: any = new Date(end_date).getTime() - new Date(start_date).getTime()
    delta1 = Math.round(Math.abs(delta1 / (1000 * 60 * 60 * 24))) + 1; // project total no of days
    console.log(delta1)
    var delta2 = new Date(now_date).getTime() - new Date(start_date).getTime() // project no of days till today
    delta2 = Math.round(Math.abs(delta2 / (1000 * 60 * 60 * 24)));
    var delta3 = new Date(end_date).getTime() - new Date(now_date).getTime() + 1
    delta3 = Math.round(Math.abs(delta3 / (1000 * 60 * 60 * 24)));

    let x_date: any;

    if (new Date(first_date).getTime() > new Date(start_date).getTime()) {
      x_date = first_date;
    } else {
      x_date = start_date;
    }

    // # project start date in current year
    // y_date = last_date if last_date < end_date else end_date
    let y_date: any;

    if (new Date(last_date).getTime() < new Date(end_date).getTime()) {
      y_date = last_date;
    } else {
      y_date = end_date;
    }

    // # project end date in current year
    var delta4 = Math.round(Math.abs((new Date(y_date).getTime() - new Date(x_date).getTime()) / (1000 * 60 * 60 * 24))) + 1 //project no of days in the current year
    var year_falls: boolean;
    if ((new Date(start_date)).getFullYear() <= _year && _year <= (new Date(end_date)).getFullYear()) {
      year_falls = true;
    } else {
      year_falls = false;
    }

    // # checks given _year falls under the claim period
    // print(start_date.year, end_date.year, year_falls)

    var value_total = Math.round(Number(value * volume)) // total revenue generated
    var value_year = Math.round(Number((value_total * delta4) / delta1))
    // # revenue generated for current year
    var value_now = Math.round((Number((value_total * delta2) / delta1)))

    // console.log(value_now, value_total, value_year);

    return [value_now, value_total, value_year, delta1]

  }

}
