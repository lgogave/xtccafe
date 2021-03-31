import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DemoRequestPage } from './demo-request.page';

describe('DemoRequestPage', () => {
  let component: DemoRequestPage;
  let fixture: ComponentFixture<DemoRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoRequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DemoRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
