import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddSalesPage } from './add-sales.page';

describe('AddSalesPage', () => {
  let component: AddSalesPage;
  let fixture: ComponentFixture<AddSalesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSalesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddSalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
