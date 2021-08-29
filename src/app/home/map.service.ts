import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { mapboxToken } from '../config';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  addMarker() {
    console.log(this.map);
    const el = document.createElement("div");
    el.className = "marker";
    new mapboxgl.Marker()
      .setLngLat(this.center)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML( // add popups
          `
      <h3>Find us here!</h3>
      <h4>
MacRitchie Nature Trail & Reservoir Park<br/>
MacRitchie Reservoir Park <br/>Singapore 298717
      </h4>`)
      )
      .addTo(this.map);
  }
  map!: mapboxgl.Map;
  constructor() {

  }
  center: mapboxgl.LngLatLike = [103.8163, 1.3426];
  constructMap() {
    this.map = new mapboxgl.Map({
      accessToken: mapboxToken,
      container: 'map',
      style: "mapbox://styles/mapbox/dark-v10?optimize=true",
      center: this.center,
      zoom: 13
    });

  }
  flyToStore() {
    this.map.flyTo({
      center: this.center,
      zoom: 15
    });
  }
}
