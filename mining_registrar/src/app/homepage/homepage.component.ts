import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  ORG1_TOKEN: String;
  ORG2_TOKEN: String;
  ORG3_TOKEN: String;

  constructor(public http: HttpClient) { }
  token_url = environment.token_url

  ngOnInit() {
    this.ORG1_TOKEN = localStorage.getItem('ORG1_TOKEN');
    this.ORG2_TOKEN = localStorage.getItem('ORG2_TOKEN');
    this.ORG3_TOKEN = localStorage.getItem('ORG3_TOKEN');
    if (this.ORG1_TOKEN == null){
      this.getTokens();
    }
    
  }

  getTokens() {
    var url = this.token_url;

    const formData = new FormData();
    formData.append('username', 'Client2');
    formData.append('orgName', 'Org1');
    formData.append('userRole', 'mining_company');

    var headers = new HttpHeaders({
      "content-type": "application/x-www-form-urlencoded"
    })

    this.http.post(url, 'username=Client2&orgName=Org1&userRole=mining_company', { headers: headers }).subscribe(
      data => {
        localStorage.setItem('ORG1_TOKEN', data['token']);
        console.log(data);
      }, error => {
        console.log(error)
      }
    )

    this.http.post(url, 'username=Mining2&orgName=Org2&userRole=ministry_of_mining', {headers: headers}).subscribe( 
      data => {
        localStorage.setItem('ORG2_TOKEN', data['token']);
        console.log(data);
      }, error => {
        console.log(error)
      }
    )

    this.http.post(url, 'username=Agri2&orgName=Org3&userRole=ministry_of_land', {headers: headers}).subscribe( 
      data => {
        localStorage.setItem('ORG3_TOKEN', data['token']);
        console.log(data);
      }, error => {
        console.log(error)
      }
    )
  }
  public now: Date = new Date();

}
