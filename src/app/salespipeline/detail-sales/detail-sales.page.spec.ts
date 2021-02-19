import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailSalesPage } from './detail-sales.page';

describe('DetailSalesPage', () => {
  let component: DetailSalesPage;
  let fixture: ComponentFixture<DetailSalesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailSalesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailSalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
