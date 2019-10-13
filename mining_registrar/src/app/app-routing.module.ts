import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MinistryMiningComponent } from './ministry-mining/ministry-mining.component';
import { MinistryLandAgriComponent } from './ministry-land-agri/ministry-land-agri.component';
import { MinistryFinanceComponent } from './ministry-finance/ministry-finance.component';
import { MiningCompanyComponent } from './mining-company/mining-company.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NewRequestFormComponent } from './new-request-form/new-request-form.component';


const routes: Routes = [
  { path: '',redirectTo:'/homepage', pathMatch:'full'},
  { path: 'homepage', component: HomepageComponent},
  { path: 'new-request-form', component: NewRequestFormComponent },
  { path: 'ministry-land-agri', component: MinistryLandAgriComponent },
  { path: 'ministry-mining', component: MinistryMiningComponent},
  { path: 'ministry-finance', component: MinistryFinanceComponent},
  { path: 'mining-company', component: MiningCompanyComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})

export class AppRoutingModule { }
