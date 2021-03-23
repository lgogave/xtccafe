import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommentsSalesPage } from './comments-sales.page';

describe('CommentsSalesPage', () => {
  let component: CommentsSalesPage;
  let fixture: ComponentFixture<CommentsSalesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsSalesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsSalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
