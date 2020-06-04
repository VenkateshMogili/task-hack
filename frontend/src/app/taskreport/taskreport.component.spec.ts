import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskreportComponent } from './taskreport.component';

describe('TaskreportComponent', () => {
  let component: TaskreportComponent;
  let fixture: ComponentFixture<TaskreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
