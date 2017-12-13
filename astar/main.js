(function () {
  "use strict";

  var WIDTH = 15;
  var HEIGHT = 15;

  var placeStart = true;
  var pathStart = null;
  var pathEnd = null;
  var grid = [];

  function isWall(target) {
    return !!target.isWall;
  }

  function isChecked(target) {
    return !!target.isChecked;
  }

  function setChecked(target) {
    target.element.classList.add("checked");
    target.isChecked = true;
  }

  function setPath(target) {
    target.element.classList.add("path");
  }

  function clearPath() {
    for (var i = 0; i < grid.length; i++) {
      var gridObj = grid[i];
      gridObj.isChecked = false;
      gridObj.element.classList.remove("checked");
      gridObj.element.classList.remove("path");
    }
  }

  function placeStartEnd(target) {
    if (!isWall(target)) {
      if (placeStart) {
        if (pathStart)
          pathStart.element.classList.remove("start");

        pathStart = target;
        pathStart.element.classList.add("start");
      }
      else {
        if (pathEnd)
          pathEnd.element.classList.remove("end");

        pathEnd = target;
        pathEnd.element.classList.add("end");
      }

      placeStart = !placeStart;
    }
  }

  function toggleWall(target) {
    if (isWall(target))
      target.element.classList.remove("wall");
    else
      target.element.classList.add("wall");

      target.isWall = !target.isWall;
  }

  function onGridClick(e) {
    if (e.button === 0)
      placeStartEnd(this);
    else if (e.button === 2)
      toggleWall(this);

    findPath();
  }

  function buildGrid(width, height) {
    var gridId = 0;

    for (var y = 0; y < height; y++) {
      var row = document.createElement("div");
      row.className = "gridrow";

      for (var x = 0; x < width; x++) {
        var gridObj = {};
        var square = document.createElement("div");
        square.id = "grid" + gridId;
        square.className = "gridsquare";
        square.onmouseup = onGridClick.bind(gridObj);
        square.oncontextmenu = () => false;

        gridObj.gridId = gridId++;
        gridObj.element = square;
        gridObj.isChecked = false;
        gridObj.isWall = false;
        gridObj.x = x;
        gridObj.y = y;

        row.appendChild(square);
        grid.push(gridObj);
      }

      document.body.appendChild(row);
    }
  }

  function getUncheckedChildren(target) {
    var children = [];
    var gridId = target.gridId;
    if (gridId >= WIDTH) {
      var up = grid[gridId - WIDTH];
      if (!isChecked(up) && !isWall(up))
        children.push(up);
    }

    if ((gridId % WIDTH) > 0) {
      var left = grid[gridId - 1];
      if (!isChecked(left) && !isWall(left))
        children.push(left);
    }

    if ((gridId % WIDTH) < (WIDTH - 1)) {
      var right = grid[gridId + 1];
      if (!isChecked(right) && !isWall(right))
        children.push(right);
    }

    if (gridId < (WIDTH * (HEIGHT - 1))) {
      var down = grid[gridId + WIDTH];
      if (!isChecked(down) && !isWall(down))
        children.push(down);
    }

    return children;
  }

  function findPath() {
    clearPath();

    if (!pathStart || !pathEnd) return;

    var queue = [pathStart];
    var path = {};
    setChecked(pathStart);

    while (queue.length != 0) {
      var current = queue.shift();
      if (current === pathEnd) break;

      var children = getUncheckedChildren(current);
      for (var i = 0; i < children.length; i++) {
        setChecked(children[i]);
        queue.push(children[i]);
        path[children[i].gridId] = current;
      }
    }

    visualisePath(path);
  }

  function visualisePath(path) {
    var node = path[pathEnd.gridId];
    while (!!node && node != pathStart) {
      setPath(node);
      node = path[node.gridId];
    }
  }

  function main() {
    buildGrid(WIDTH, HEIGHT);
  }

  window.onload = main;
})();
