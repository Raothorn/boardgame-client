<template>
  <div id="map_container" class="fill-height ma-0 pa-0">
      <object
        id="map_obj"
        data="assets/maps/region1.svg"
        type="text/svg"
        @load="mapLoad"
      ></object>
  </div>
</template>

<script setup lang="ts">
import { SVG, Element, Path, Svg,  } from "@svgdotjs/svg.js";
import { ref } from "vue";

var mapSvg: Svg;
var mapHeight: number;

const svg_loaded = ref(false);

var dragY: number | null = null;

function mapLoad() {
  const obj = document.querySelector("#map_obj") as any;
  const svg = obj.contentDocument as Document;
  let mapContainer = document.getElementById("map_container");

  if (mapContainer == null || svg == null) return;

  mapSvg = SVG(svg.querySelector("#svg1")) as Svg;
  svg_loaded.value = true;

  const originalWidth = mapSvg.width() as number;
  mapHeight = mapSvg.height() as number;

  mapSvg.size("100%", "100%")
  let scaleY = mapHeight / mapSvg.rbox()?.h as number;
  mapSvg.viewbox(0, 0, originalWidth, mapContainer.offsetHeight * scaleY);


  // Handle mouse drag
  function onMouseDown(e: MouseEvent) {
    dragY = e.pageY;
  }

  function onMouseUp(e: MouseEvent) {
    dragY = null;
  }

  function onMouseMove(e: MouseEvent) {
    if (dragY == null || mapContainer == null)
      return;

    const dy = dragY - e.pageY;
    dragY = e.pageY;
    scrollViewport(dy * scaleY)
  }

  // Map Dragging
  mapSvg.mousedown(onMouseDown);
  mapSvg.mouseup(onMouseUp);
  mapSvg.mousemove(onMouseMove);
  mapSvg.mouseleave(onMouseUp);

}

function animateShip() {
  let dot = mapSvg.findOne("#ship") as Element;
  let path = mapSvg.findOne("#path1") as Path;

  if (path == null || dot == null) return;

  let pathLength = path.length();

  let pt0 = path.pointAt(0);

  const scale = 4;
  const invScale = 1 / 4;
  dot.move(pt0.x, pt0.y).scale(scale);

  let t = 0;
  let handle = setInterval(() => {
    if (t > 1)
      t = 0;

    let point = path.pointAt(pathLength * t);

    let [dx, dy] = [point.x - pt0.x, point.y-pt0.y];
    pt0 = point;

    let angle = Math.atan2(dy,dx) * (180 / Math.PI);
    console.log(angle);

    let oldAngle = dot.transform().rotate;
    console.log(oldAngle)


    if (oldAngle != null) {
      dot.rotate(-oldAngle)
        .scale(invScale)
        .move(point.x, point.y)
        .scale(scale)
        .rotate(angle);
    }
    // dot.transform({relative: [point.x, point.y], scale: [1.4, 1.4]})


    // dot.transform({position: [point.x, point.y]}, true);

    //Center viewbox around dot
    let viewbox = mapSvg.viewbox();
    viewbox.y = point.y - viewbox.height / 2;
    viewbox.y2 = point.y + viewbox.height / 2;

    mapSvg.viewbox(viewbox);

    t += 0.002;
  }, 10);
}


function scrollViewport(dy: number) {
  if (mapSvg == undefined) return;

  let viewport = mapSvg.viewbox();
  viewport.y += dy;

  if (viewport.y < 0 ||  viewport.y + viewport.height > mapHeight){
    return;
  }
  mapSvg.viewbox(viewport);
}
</script>
