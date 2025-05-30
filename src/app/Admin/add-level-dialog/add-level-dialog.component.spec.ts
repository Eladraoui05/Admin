import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLevelDialogComponent } from './add-level-dialog.component';

describe('AddLevelDialogComponent', () => {
  let component: AddLevelDialogComponent;
  let fixture: ComponentFixture<AddLevelDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddLevelDialogComponent]
    });
    fixture = TestBed.createComponent(AddLevelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
