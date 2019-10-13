import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

import { DetailspopupComponent } from '../detailspopup/detailspopup.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-request-form',
  templateUrl: './new-request-form.component.html',
  styleUrls: ['./new-request-form.component.css'],
})
export class NewRequestFormComponent implements OnInit {
  server_url = environment.server_url
  today = new Date();
  submitted = false;
  result: any;
  nextDate: any;
  flag: any;
  dateFlag: any;
  ores = ['COPPER', 'NICKEL', 'LEAD', 'ZINC', 'ALUMINIUM', 'GOLD', 'SILVER', 'PLATINUM', 'DIAMONDS', 'IRON', 'BAUXITE', 'COAL', 'DOLOMITE', 'URANIUM'];
  companies = ['Golden Bull', 'VPR Mining', 'Coal India', 'Hindustan Zinc', 'Jiangxi Copper', 'Uralkaliy']
  newRequestForm: FormGroup;

  ORG1_TOKEN: String;
  ORG2_TOKEN: String;
  ORG3_TOKEN: String;

  constructor(private datePipe: DatePipe, private formBuilder: FormBuilder, private router: Router, public dialog: MatDialog, private http: HttpClient) { }
  ngOnInit() {
    this.ORG1_TOKEN = localStorage.getItem('ORG1_TOKEN');
    this.ORG2_TOKEN = localStorage.getItem('ORG2_TOKEN');
    this.ORG3_TOKEN = localStorage.getItem('ORG3_TOKEN');
    console.log(new Date());
    var today = new Date()
    var str_today = this.datePipe.transform(today, "yyyyMMddHHmmss");
    console.log(str_today)
    this.newRequestForm = this.formBuilder.group({
      comp_name: ['', [Validators.required, Validators.maxLength(30)]],
      cord: ['', Validators.required],
      ore: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      value: ['', Validators.required],
      volume: ['', Validators.required]
      //email: ['', [Validators.required, Validators.email]],
      //password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  onInputValue(event: any) {
    console.log(event);
    this.nextDate = event;
  }
  get f() {
    return this.newRequestForm.controls;
  }
  onSubmit() {
    var form_data = this.newRequestForm.value;
    //console.log(form_data['start_time'].toDateString());
    //console.log(JSON.stringify(form_data['start_time'].toDateString()), "formdata");
    var startDate = this.datePipe.transform(form_data['start_time'], "yyyy-MM-dd");
    var endDate = this.datePipe.transform(form_data['end_time'], "yyyy-MM-dd");
    this.newRequestForm.value['start_time'] = startDate;
    this.newRequestForm.value['end_time'] = endDate;
    if (startDate <= endDate) {
      this.dateFlag = false;
      console.log(this.dateFlag, "1");
    }
    else {
      this.dateFlag = true;
      console.log(this.dateFlag, "2");
    }
    var today = new Date()
    var str_today = this.datePipe.transform(today, "yyyyMMddHHmmss");
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', "authorization": "Bearer " + this.ORG1_TOKEN });
    let options = { headers: headers };

    var body = JSON.stringify({
      "peers": ["peer0.org1.example.com", "peer0.org2.example.com", "peer0.org3.example.com"],
      "fcn": "submitClaim",
      "args": ["CLAIM-" + str_today, this.newRequestForm.value.cord, this.newRequestForm.value.ore, startDate, endDate, this.newRequestForm.value.comp_name, "pending", today, String(this.newRequestForm.value.value), String(this.newRequestForm.value.volume)]
    })

    if (this.newRequestForm.valid) {
      const dialogRef = this.dialog.open(DetailspopupComponent, {
        width: '400px',
        data: { flag: 'true', action: 'submit' }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.flag = result;
        if (this.flag == true) {
          var url = this.server_url
          this.http.post(url, body, options).subscribe(data => {
            this.result = data;
            console.log(data);
            if (this.result) {
              if (data['success']) {
                const dialogRef = this.dialog.open(DetailspopupComponent, { width: '350px', data: { "message": "Claim request submitted successfully" } });
              } else {
                const dialogRef = this.dialog.open(DetailspopupComponent, { width: '350px', data: { "message": data['message'] } });
              }
              this.router.navigate(['mining-company']);
            }
          }, error => { 
            console.log(error); 
            if (error.status == 401) {
              localStorage.clear();
              this.router.navigate(['/homepage']);
            };
          });
        }
      });
    }

    this.submitted = true;
    if (this.newRequestForm.invalid) {
      return;
    }

  }
}
