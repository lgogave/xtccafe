import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditSalesPage } from './edit-sales.page';

describe('EditSalesPage', () => {
  let component: EditSalesPage;
  let fixture: ComponentFixture<EditSalesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSalesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditSalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
