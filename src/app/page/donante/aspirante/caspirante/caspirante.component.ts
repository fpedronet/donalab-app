import { Component, OnInit } from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-caspirante',
  templateUrl: './caspirante.component.html',
  styleUrls: ['./caspirante.component.css']
})
export class CaspiranteComponent implements OnInit {

  foto?: string =environment.UrlImage + "people.png";

  constructor() {
   }


  ngOnInit(): void {
  }

  guardar(){

  }
}
