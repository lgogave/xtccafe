import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DemoRequestListPage } from './demo-request-list.page';

describe('DemoRequestListPage', () => {
  let component: DemoRequestListPage;
  let fixture: ComponentFixture<DemoRequestListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoRequestListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DemoRequestListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
