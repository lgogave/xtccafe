import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuCardPage } from './menu-card.page';

describe('MenuCardPage', () => {
  let component: MenuCardPage;
  let fixture: ComponentFixture<MenuCardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuCardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
