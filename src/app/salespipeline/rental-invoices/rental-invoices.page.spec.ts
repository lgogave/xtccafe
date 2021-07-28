import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RentalInvoicesPage } from './rental-invoices.page';

describe('RentalInvoicesPage', () => {
  let component: RentalInvoicesPage;
  let fixture: ComponentFixture<RentalInvoicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentalInvoicesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RentalInvoicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
