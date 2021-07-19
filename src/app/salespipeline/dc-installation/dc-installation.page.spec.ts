import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DcInstallationPage } from './dc-installation.page';

describe('DcInstallationPage', () => {
  let component: DcInstallationPage;
  let fixture: ComponentFixture<DcInstallationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcInstallationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DcInstallationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
