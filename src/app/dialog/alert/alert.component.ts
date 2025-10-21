import { InputDataService } from './../../@services/input-data.service';
import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert',
  imports: [MatDialogModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  constructor(private inputDataService: InputDataService) { }
  readonly router = inject(Router);
  readonly dialogRef = inject(MatDialogRef<AlertComponent>);
  readonly data = inject<{ message: string }>(MAT_DIALOG_DATA);

  onClick() {
    this.dialogRef.close();
  }

}
