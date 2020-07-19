import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as maptalks from 'maptalks';
/**
 * 地图功能模块，需要提供以下功能：
 * 1. 地图显示
 * 2. 地图GeoJson加载
 * 3. GeoJson编辑
 * @author yellow 2020/7/19
 */
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  @ViewChild('mapDiv') mapDiv: ElementRef;

  ngAfterViewInit() {
    const map1 = new maptalks.Map(this.mapDiv.nativeElement, {
      center: [-0.113049, 51.498568],
      zoom: 14,
      baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        subdomains: ['a', 'b', 'c', 'd'],
        attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
      })
    });
  }

}