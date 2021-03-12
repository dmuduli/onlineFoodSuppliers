import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatterComponent } from './platter.component';

describe('PlatterComponent', () => {
  let component: PlatterComponent;
  let fixture: ComponentFixture<PlatterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlatterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
