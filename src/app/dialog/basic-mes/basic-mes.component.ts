import { InputDataService } from './../../@services/input-data.service';
import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basic-mes',
  imports: [MatDialogModule],
  templateUrl: './basic-mes.component.html',
  styleUrl: './basic-mes.component.scss'
})
export class BasicMesComponent {
  constructor(private inputDataService: InputDataService) { }
  readonly router = inject(Router);
  readonly dialogRef = inject(MatDialogRef<BasicMesComponent>);
  readonly data = inject<{ title: string ; message: string }>(MAT_DIALOG_DATA);

  onClick() {
    this.dialogRef.close();
  }

}
