import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClientBillingPage } from './client-billing.page';

describe('ClientBillingPage', () => {
  let component: ClientBillingPage;
  let fixture: ComponentFixture<ClientBillingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientBillingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientBillingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
