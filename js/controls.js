// maze generator v0.01
var slider = document.getElementById("slider-linew");
var output = document.getElementById("lw-lbl");
var slidergl = document.getElementById("slider-glows");
var outputgl = document.getElementById("gl-lbl");

/* Update the Maze Style color to Light */
$("input:radio[name='light']").change(function() {
  $("input:radio[name='dark']:checked")[0].checked = false;
  $("#maze").css("background-color", "white");
  updateMazeStyle(true);
});

/* Update the Maze Style color to Dark */
$("input:radio[name='dark']").change(function() {
  $("input:radio[name='light']:checked")[0].checked = false;
  $("#maze").css("background-color", "black");
  updateMazeStyle(false);
});

/* Update the line width and call Draw Maze to redraw the maze */
slider.oninput = function() {
  output.innerHTML = this.value + 'px';
  updateLineWidth(this.value);
}

/* Choose the Glow Effect color */
$("#clrpicker").change(function() {
  updateGlowStatus(true, $("#clrpicker").val());
});

/* Clear the Glow Effect */
$("#reset-btn").click(function() {
  updateGlowStatus(false, null);
});

/* Update the line width and call Draw Maze to redraw the maze */
slidergl.oninput = function() {
  outputgl.innerHTML = this.value + 'px';
  updateGlowSize(this.value);
}
