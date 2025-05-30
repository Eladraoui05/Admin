import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title?: string,
      message?: string,
      confirmText?: string,
      cancelText?: string
    }
  ) {
    // Valeurs par défaut
    this.data = {
      title: data.title || 'Confirmation',
      message: data.message || 'Êtes-vous sûr de vouloir effectuer cette action ?',
      confirmText: data.confirmText || 'Confirmer',
      cancelText: data.cancelText || 'Annuler',
      ...data
    };}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}