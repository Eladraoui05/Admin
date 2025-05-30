import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLevelDialogComponent } from './edit-level-dialog.component';

describe('EditLevelDialogComponent', () => {
  let component: EditLevelDialogComponent;
  let fixture: ComponentFixture<EditLevelDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditLevelDialogComponent]
    });
    fixture = TestBed.createComponent(EditLevelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
