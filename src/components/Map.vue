<template>
  <div id="map_container" class="fill-height ma-0 pa-0">
      <object
        id="map_obj"
        data="assets/maps/region1.svg"
        type="text/svg"
        class="ma-0 pa-0"
        @load="mapLoad"
      ></object>
  </div>
</template>

<script setup lang="ts">
import { SVG, Element } from "@svgdotjs/svg.js";
import { ref } from "vue";

var map_svg: Element;
const svg_loaded = ref(false);

var dragX: number | null = null;
var dragY: number | null = null;

function mapLoad() {
  const obj = document.querySelector("#map_obj") as any;
  const svg = obj.contentDocument as Document;

  map_svg = SVG(svg.querySelector("#svg1"));
  svg_loaded.value = true;

  const originalWidth = map_svg.width() as number;
  const originalHeight = map_svg.height() as number;

  let mapContainer = document.getElementById("map_container");
  map_svg.size("100%", "100%");

  const newWidth = map_svg.rbox()?.w as number;
  const newHeight = map_svg.rbox()?.h as number;

  let [scaleX, scaleY] = [originalWidth / newWidth, originalHeight / newHeight];

  let root = map_svg.findOne("#root") as Element;

  function onMouseDown(e: MouseEvent) {
    const mapX = (root?.x() as number) / scaleX;
    const mapY = (root?.y() as number) / scaleY;

    dragX = e.pageX - mapX;
    dragY = e.pageY - mapY;
  }

  function onMouseUp(e: MouseEvent) {
    dragX = null;
    dragY = null;
  }

  function onMouseMove(e: MouseEvent) {
    if (dragX == null || dragY == null || root == null || mapContainer == null)
      return;

    const newX = e.pageX - dragX;
    const newY = e.pageY - dragY;
    // root?.x(newX * scaleX);
    if (newY < 0 && newY + newHeight > mapContainer.offsetHeight)
      root.y(newY * scaleY);
    console.log(newY + newHeight, mapContainer?.offsetHeight);
  }

  // Map Dragging
  map_svg.mousedown(onMouseDown);
  map_svg.mouseup(onMouseUp);
  map_svg.mousemove(onMouseMove);
  map_svg.mouseleave(onMouseUp);
}
</script>
