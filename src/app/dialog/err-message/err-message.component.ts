import { InputDataService } from './../../@services/input-data.service';
import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-err-message',
  imports: [MatDialogModule],
  templateUrl: './err-message.component.html',
  styleUrl: './err-message.component.scss'
})
export class ErrMessageComponent {
  constructor(private inputDataService: InputDataService) { }
  readonly router = inject(Router);
  readonly dialogRef = inject(MatDialogRef<ErrMessageComponent>);
  readonly data = inject<{ title: string ; message: string }>(MAT_DIALOG_DATA);

  onClick() {
    this.dialogRef.close();
  }

}

