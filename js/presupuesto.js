function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

var custom_bubble_chart = (function(d3, CustomTooltip) {
  "use strict";
 
  var width = 1200,
      height = 800,
      // tooltip = CustomTooltip("gates_tooltip", 240),
      gravedad = -0.01,
      damper = 0.45,
      nodes = [],
      vis, force, circles, radius_scale;
 
  var center = {x: width / 2, y: height / 2};
 
  var centroides_finalidad = {
      "1": {x: width / 6, y: height / 2},
      "2": {x: 2 * width / 6, y: height / 2},
      "3": {x: 3 * width / 6, y: height / 2},
      "4": {x: 4 * width / 6, y: height / 2},
      "5": {x: 5 * width / 6, y: height / 2}
    };
  
  var centroides_funcion = {
      "1": {x: width / 9, y: height / 2},
      "2": {x: 2 * width / 9, y: height / 2},
      "3": {x: 3 * width / 9, y: height / 2},
      "4": {x: 4 * width / 9, y: height / 2},
      "5": {x: 5 * width / 9, y: height / 2},
      "6": {x: 6 * width / 9, y: height / 2},
      "7": {x: 7 * width / 9, y: height / 2},
      "8": {x: 8 * width / 9, y: height / 2},
      "9": {x: width, y: height / 2}

    };
 
  var finalidad = ["Administración Gubernamental", "Deuda Pública - Intereses y Gastos", "Servicios de Seguridad","Servicios Económicos","Servicios Sociales"];

  var fill_color = d3.scale.ordinal()
                  .domain(finalidad)
                  .range(["#ECD078", "#D95B43", "#C02942", "#542437", "#53777A"]);
 
  function custom_chart(data) {
    var max_amount = d3.max(data, function(d) { return parseInt(d.monto, 10); } ),
	    radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([1.5, 100]);
 
    //create node objects from original data
    //that will serve as the data behind each
    //bubble in the vis, then add each node
    //to nodes to be used later
    data.forEach(function(d){
      var node = {
        id: d.id,
        radius: radius_scale(parseInt(d.monto, 10)),
        monto: d.monto,
        jurisdiccion: d.jurisdiccion,
        finalidad: d.finalidad,
        id_finalidad: d.id_finalidad,
        funcion: d.funcion,
        x: Math.random() * 1200,
        y: Math.random() * 800
      };
      nodes.push(node);
      
      console.log('Agrego datos.');
    });

    nodes.sort(function(a, b) {return b.monto - a.monto; });
 	  
    // console.log(nodes);

    vis = d3.select("#grafico").append("svg")
                .attr("width", width)
                // .attr("height", height)
                .attr("id", "svg_vis");
 
    circles = vis.selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 0)
      .attr("fill", function(d) { return fill_color(d.finalidad) ;})
      .attr("stroke-width", 1)
      .attr("stroke", function(d) {return d3.rgb(fill_color(d.finalidad)).darker();})
      .attr("id", function(d) { return  "bubble_" + d.id; })
      // .on("mouseover", function(d, i) {show_details(d, i, this);} )
      // .on("mouseout", function(d, i) {hide_details(d, i, this);} );
 
    circles.transition().duration(2500).attr("r", function(d) { return d.radius; });


 
  }
 
  function charge(d) {
    if (d.value < 0) {
      return 0
    } else {
      return -Math.pow(d.radius,2.4)/7 
    };
  }
 
  function start() {
    console.log('Inicio todo.');

    force = d3.layout.force()
            .nodes(nodes)
            .size([width, height]);


  }
  


  function mostrarGrupoCompleto() {
    // console.log('Inicio force.');
    force.gravity(gravedad)
         .charge(charge)
         .friction(0.9)
         .on("tick", function(e) {
            circles.each(moverAlCentro(e.alpha))
                   .attr("cx", function(d) {return d.x;})
                   .attr("cy", function(d) {return d.y;});
         });
    // console.log(force);
    force.start();
    hide_years();
  }
 
  function moverAlCentro(alpha) {
    // console.log('Muevo objetos al centro.');
    return function(d) {
      d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha;
      d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha;
    };
  }
 
  function ver_finalidad() {
    force.gravity(gravedad)
         .charge(charge)
         .friction(0.9)
        .on("tick", function(e) {
          circles.each(ordenFinalidad(e.alpha))
                 .attr("cx", function(d) {return d.x;})
                 .attr("cy", function(d) {return d.y;});
        });
    force.start();
    titulosFinalidad();
  }
 
  function ordenFinalidad(alpha) {
    return function(d) {
      var target = centroides_finalidad[d.id_finalidad];
      d.x = d.x + (target.x - d.x) * (damper + 0.02) * alpha * 1.2;
      d.y = d.y + (target.y - d.y) * (damper + 0.02) * alpha * 1.2;
    };
  }
 
 
  function titulosFinalidad() {
      var finalidadId = {
                      "1": width/8,
                      "2": width,
                      "3": width,
                      "4": width,
                      "5": width
                    };

                    // "1": {x: width / 6, y: height / 2},
                    // "2": {x: 2 * width / 6, y: height / 2},
                    // "3": {x: 3 * width / 6, y: height / 2},
                    // "4": {x: 4 * width / 6, y: height / 2},
                    // "5": {x: 5 * width / 6, y: height / 2}
      var finalidadKeys = d3.keys(finalidadId);
      var finalidad = vis.selectAll(".finalidad")
                 .data(finalidadKeys);
 
      finalidad.enter().append("text")
                   .attr("class", "finalidad")
                   .attr("x", function(d) { return finalidadId[d]; }  )
                   .attr("y", 40)
                   .attr("text-anchor", "middle")
                   .text(function(d) { return d;});
 
  }
 
  function hide_years() {
      var finalidad = vis.selectAll(".finalidad").remove();
  }
 
 
  function show_details(data, i, element) {
    d3.select(element).attr("stroke", "black");
    var content = "<span class=\"name\">Jurisdicción:</span><span class=\"value\"> " + data.jurisdiccion + "</span><br/>";
    content +="<span class=\"name\">Finalidad:</span><span class=\"value\"> " + data.finalidad + "</span><br/>";
    content +="<span class=\"name\">Función:</span><span class=\"value\"> " + data.funcion + "</span><br/>";
    content +="<span class=\"name\">Monto:</span><span class=\"value\"> $" + addCommas(data.monto)  + "</span>";
    tooltip.showTooltip(content, d3.event);
  }

	/*
   	id_jurisdiccion
   	jurisdiccion
   	id_finalidad
   	finalidad
   	id_funcion
   	funcion
   	monto
   	porcentaje
 	*/

  function hide_details(data, i, element) {
    d3.select(element).attr("stroke", function(d) { return d3.rgb(fill_color(d.finalidad)).darker();} );
    tooltip.hideTooltip();
  }
 
  var presupuesto = {};
  presupuesto.init = function (_data) {
    custom_chart(_data);
    start();
  };
 
  presupuesto.display_all = mostrarGrupoCompleto;
  presupuesto.display_year = ver_finalidad;

  presupuesto.toggle_view = function(view_type) {
    if (view_type == 'year') {
      ver_finalidad();
    } else {
      mostrarGrupoCompleto();
      }
    };
 
  return presupuesto;
})(d3);

d3.csv("/data/presupuesto.csv", function(data) {
        custom_bubble_chart.init(data);
        custom_bubble_chart.toggle_view('all');
    });


$(document).ready(function() {
  $('#view_selection a').click(function() {
    var view_type = $(this).attr('id');
    $('#view_selection a').removeClass('active');
    $(this).toggleClass('active');
    	custom_bubble_chart.toggle_view(view_type);
    return false;
  });

  $('#my-tooltip').tooltipster({
    contentAsHTML: true,
    theme: 'tooltipster-light',
    content: $('<span><strong>This text is in bold case !</strong><br>Explorá la distribución del presupuesto de la Ciudad Autónoma de Buenos Aires para 2014.</span>')
  });
});
