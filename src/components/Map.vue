<template>
  <div id="map_container" class="fill-height ma-0 pa-0">
    <object
      id="map_obj"
      :data="svg_source"
      type="text/svg"
      @load="mapLoad"
      :style="svg_loaded ? '' : 'visibility: hidden'"
    ></object>
    <template v-show="!svg_loaded"> Loading... </template>
  </div>
</template>

<script setup lang="ts">
import useClient from "@/stores/ClientState";
import { SVG, Element, Path, Svg, Matrix, Point } from "@svgdotjs/svg.js";
import { computed, ref, watch } from "vue";

const client = useClient();

var mapSvg: Svg;
var ship: Element;
var mapHeight: number;
var root: Element;

const svg_loaded = ref(false);


// Computed Properties

const shouldHighlightAreas = computed(() => {
  let phase = client.gamestate.phase;
  console.log("phase")
  return "MainActionPhase" in phase;
})

const svg_source = computed(() => {
  let region = client.gamestate.map.current_region;
  return `assets/maps/region${region}.svg`
});

// Watchers
watch(
  () => client.gamestate.map.ship_area,
  (oldArea, newArea) => {
    animateShip(oldArea, newArea, highlightAreas);
  },
);

// Functions
function mapLoad() {
  svg_loaded.value = false;
  const obj = document.querySelector("#map_obj") as any;
  const svg = obj.contentDocument as Document;
  let mapContainer = document.getElementById("map_container");

  if (mapContainer == null || svg == null) return;

  mapSvg = SVG(svg.querySelector("#svg1")) as Svg;

  const originalWidth = mapSvg.width() as number;
  mapHeight = mapSvg.height() as number;

  mapSvg.size("100%", "100%");
  let scaleY = (mapHeight / mapSvg.rbox()?.h) as number;
  mapSvg.viewbox(0, 0, originalWidth, mapContainer.offsetHeight * scaleY);

  root = mapSvg.findOne("#root") as Element;

  // Handle mouse drag
  var dragY: number | null = null;
  function onMouseDown(e: MouseEvent) {
    dragY = e.pageY;
  }

  function onMouseUp(e: MouseEvent) {
    dragY = null;
  }

  function onMouseMove(e: MouseEvent) {
    if (dragY == null || mapContainer == null) return;

    const dy = dragY - e.pageY;
    dragY = e.pageY;
    scrollViewport(dy * scaleY);
  }

  // Map Dragging
  mapSvg.mousedown(onMouseDown);
  mapSvg.mouseup(onMouseUp);
  mapSvg.mousemove(onMouseMove);
  mapSvg.mouseleave(onMouseUp);

  // Root transform

  // Ship setup
  ship = mapSvg.findOne("#ship") as Element;

  let startingPos = mapSvg.findOne("#ship_zone_1") as Element;
  ship.transform({relative: [startingPos.x() as number, startingPos.y() as number]});

  centerShipInViewbox();


  highlightAreas();
  svg_loaded.value = true;
}

function highlightAreas() {
  let map = client.gamestate.map;
  let visibleAreas = map.visible_areas;
  let adjacentAreas = map.adjacent_areas;

  let areas: [number, string][] = visibleAreas.map((a) => [a, `#area${a}`]);

  for (let [areaIx, areaId] of areas) {
    let area = mapSvg.findOne(areaId) as Element;
    if (!area) break;

    if (shouldHighlightAreas.value && adjacentAreas.includes(areaIx)) {
      area.addClass("available");
      area.click(() => travelAction(areaIx));
    } else {
      console.log("removing highlight on ", areaIx)
      area.removeClass("available");
      area.click(null);
    }
  }
}

function travelAction(areaIx: number) {
  let msg = {
    actionType: "travelAction",
    actionData: { to_area: areaIx, player_ix: 0 },
  };

  client.sendMessage("action", msg);
}

function animateShip(oldArea: number, newArea: number, callback: () => void) {
  let min = Math.min(oldArea, newArea);
  let max = Math.max(oldArea, newArea);

  const backwards = newArea > oldArea;

  // The convention is to id the path from the
  // smaller area index to the lartger
  const pathId = `#path${min}_${max}`;
  let path = mapSvg?.findOne(pathId) as Path;

  if (path == null || ship == null) return;

  let pathLength = path.length();

  let pt0 = path.pointAt(0);

  ship.transform(new Matrix());

  let rootTransform = root.transform();


  let t = 0;

  // Arcane bullshit to calculate animation delta with stupid arbitrary scales
  let dt = 10;
  if (rootTransform.scaleX && rootTransform.scaleY) {
    let dp = new Point(dt / rootTransform.scaleX, dt / rootTransform.scaleY);
    dt = Math.sqrt(dp.x * dp.x + dp.y * dp.y);
  }

  let handle = setInterval(() => {
    if (t > pathLength) {
      clearInterval(handle);
      callback();
    }

    let t0 = backwards ? pathLength - t : t;
    let point = path.pointAt(t0) as Point;

    let [dx, dy] = [point.x - pt0.x, point.y - pt0.y];
    pt0 = point;

    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    let oldAngle = ship.transform().rotate;

    if (oldAngle != null) {
      try {
        ship
          .rotate(-oldAngle)
          .move(point.x, point.y)
          .rotate(angle);
      } catch (e) {
        // Not sure why this exception is happening. Everything seems fine.
      }
    }

    centerShipInViewbox();

    t += dt;
  }, 5);
}

function centerShipInViewbox() {
    if (!ship || !root) {
      return;
    }

    let viewbox = mapSvg.viewbox();

    let shipY = ship.y() as number;
    let scaleY = root.transform().scaleY
    if (scaleY != undefined) {
      shipY *= scaleY
    }
    let newY = shipY - viewbox.height / 2;

    if (newY < 0) {
      newY = 0;
    }
    if (newY + viewbox.height > mapHeight) {
      newY = mapHeight - viewbox.height;
    }

    viewbox.y = newY;
    mapSvg.viewbox(viewbox);

}

function scrollViewport(dy: number) {
  if (mapSvg == undefined) return;

  let viewport = mapSvg.viewbox();
  viewport.y += dy;

  if (viewport.y < 0 || viewport.y + viewport.height > mapHeight) {
    return;
  }
  mapSvg.viewbox(viewport);
}
</script>
