import { CommonModule } from '@angular/common';
import {Component, Input} from '@angular/core';

@Component({
    selector: 'print-error',
    templateUrl: './print-error.component.html',
    providers: [],
    standalone: true,
    imports: [CommonModule]
})
export class PrintError {

    @Input("control")
    control: any;
}