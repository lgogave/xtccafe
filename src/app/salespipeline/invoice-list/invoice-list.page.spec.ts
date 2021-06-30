import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InvoiceListPage } from './invoice-list.page';

describe('InvoiceListPage', () => {
  let component: InvoiceListPage;
  let fixture: ComponentFixture<InvoiceListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
