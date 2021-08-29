import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MapService } from '../map.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  constructor(private mapService: MapService) { }
  flyToStore() {
    this.mapService.flyToStore();
  }

  ngOnInit(): void {
    this.mapService.constructMap();
    this.mapService.addMarker();
  }
}
