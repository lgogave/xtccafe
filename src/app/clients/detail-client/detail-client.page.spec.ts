import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailClientPage } from './detail-client.page';

describe('DetailClientPage', () => {
  let component: DetailClientPage;
  let fixture: ComponentFixture<DetailClientPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailClientPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailClientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
