import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangerInputComponent } from './manger-input.component';

describe('MangerInputComponent', () => {
  let component: MangerInputComponent;
  let fixture: ComponentFixture<MangerInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MangerInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MangerInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
