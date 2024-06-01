import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusHeatingComponent } from './status-heating.component';

describe('StatusHeatingComponent', () => {
  let component: StatusHeatingComponent;
  let fixture: ComponentFixture<StatusHeatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusHeatingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatusHeatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
