import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';

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
