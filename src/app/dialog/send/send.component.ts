import { InputDataService } from './../../@services/input-data.service';
import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send',
  imports: [MatDialogModule],
  templateUrl: './send.component.html',
  styleUrl: './send.component.scss'
})
export class SendComponent {
  constructor(private inputDataService: InputDataService) { }
  readonly router = inject(Router);
  readonly dialogRef = inject(MatDialogRef<SendComponent>);
  readonly data = inject<{ message: string }>(MAT_DIALOG_DATA);

  onClick() {
    this.dialogRef.close();
  }

}
