import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GrnlistPage } from './grnlist.page';

describe('GrnlistPage', () => {
  let component: GrnlistPage;
  let fixture: ComponentFixture<GrnlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrnlistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GrnlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
