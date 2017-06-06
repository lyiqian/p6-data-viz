function draw(data) {
    "use strict";
    var MARGIN = 50,
        WIDTH = 1000 - MARGIN,
        HEIGHT = 500 - MARGIN,
        MID = WIDTH / 2 + MARGIN;
    
    /* Setting up constants for circles that represent passengers */
    var RADIUS = 4.7; // selected by try-and-error
    var SKIP = 0.5; // determining the empty space between circles
    var OFFSET = RADIUS * (1 + SKIP); // the margins for circles
    var STEP = RADIUS * (2 + SKIP); // the distance between 2 circle centers
    
    var DEFAULT_GROUP = "Sex";

    /* pre-processing */
    data = data.filter(function(d) { 
        return d.Age !== "" && (d.Sex === "male" || d.Sex === "female");
    });
    data.forEach(function(d) { 
        d.Age = +d.Age;
        d.Pclass = 'Class ' + d.Pclass;
    });
    
    /* title */
    d3.select("body")
        .append("h2")
        .text("Titanic Passenger Demographics (Partial)");
    
    /* buttons for interaction */   
    var button_text = ["Gender", "Ticket Class"];
    var text_to_group = {
        "Gender": "Sex", 
        "Ticket Class": "Pclass"
    };
    
    var button_table = d3.select('body')
        .append('table')
        .attr('class', 'button')
        .append('tr')
        
    button_table.append('td')
        .text('Group By: ');
        
    var buttons = button_table.append("td")
        .selectAll("a")
        .data(button_text)
        .enter().append("a")
        .attr("class", "button")
        .attr("href", "#")
        .style("color", 'black')
        .style("border", function(d) {
            var str = "1.5px solid ";
            return d === "Gender" ? str + "orangered" : str + "lightgray";
        })
        .text(function(d) {
            return d;
        });
    

    var svg = d3.select("body")
        .append("svg")
        .attr("width", WIDTH + MARGIN)
        .attr("height", HEIGHT + MARGIN);       
    
    /* background */
    var g_background = svg.append('g').attr('class', 'background');
    
    g_background.append('rect')
        .attr('class', 'bg left')
        .attr('x', MARGIN)
        .attr('width', WIDTH / 2)
        .attr('y', 0)
        .attr('height', HEIGHT + MARGIN)
        .style('fill', 'rgb(220, 220, 220)');
        
    g_background.append('rect')
        .attr('class', 'bg right')
        .attr('x', MARGIN + WIDTH / 2)
        .attr('width', WIDTH / 2)
        .attr('y', 0)
        .attr('height', HEIGHT + MARGIN)
        .style('fill', 'lightBlue');
    
    /* subtitle */
    var subtitle = svg.append('g')
        .attr('class', 'subtitle');
    
    subtitle.append('text')
        .attr('class', 'died')
        .attr('x', MID - 2)
        .attr('y', MARGIN / 2)
        .text('Perished');
        
    subtitle.append('text')
        .attr('class', 'surv')
        .attr('x', MID + 2)
        .attr('y', MARGIN / 2)
        .text('Survived');
    
    /* Axis */
    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + MARGIN + ',' + MARGIN + ')');

    /* Count labels */
    var g_count = svg.append('g')
        .attr('class', 'count')
        .attr('transform', 'translate(0,' + MARGIN + ')');
        
    /* Circles and tooltips */   
    var g_cir = svg.append('g')
        .attr('class', 'circles')
        .attr('transform', 'translate(0,' + MARGIN + ')');  
    
    var tip = d3.tip()
        .attr('class', 'cir-tip')
        .offset([- 0.5 * RADIUS, 0])
        .html(function(d) { 
            return d.Name; 
        });
        
    g_cir.call(tip);

    function is_surv(survived) {
        return survived == "1" ? true : false;
    }   
    
    function key_func(d) {
        return d.PassengerId;
    }   

    g_cir.selectAll("circle")
        .data(data, key_func)
        .enter().append("circle")
        .attr('class', function(d) {
            return is_surv(d.Survived) ? 'surv' : 'died';
        })
        .attr('r', RADIUS)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
    
    /* helpers for calculating x and y pixel values given indices */
    function get_x_pos(surv_died, ind, n_c_col) {
        var dir = is_surv(surv_died) ? 1 : -1;
        return MID + dir * (OFFSET + Math.floor(ind / n_c_col) * STEP);
    }
    
    function get_y_pos(group, ind, n_c_col, y_scale) {
        return y_scale(group) + OFFSET + (ind % n_c_col) * STEP;
    }

    function draw_circles(g, group_data, group_by, y_scale, n_c_col) {
        g.selectAll("circle")
            .data(group_data, key_func)
            .transition().duration(700)
            .attr('cx', function(d, i) {
                return get_x_pos(d.Survived, i, n_c_col);
            })
            .attr('cy', function(d, i) {
                return get_y_pos(d[group_by], i, n_c_col, y_scale);
            });
    }
    
    function show(group_by, data, svg, g_cir, g_count) { 
        /* scales & axes */
        var y_scale = d3.scale.ordinal()
        .rangeRoundBands([0, HEIGHT], .25, .15);
        
        y_scale.domain(data.map(function(d) { 
            return d[group_by]; 
        }).sort());
        
        var y_axis = d3.svg.axis()
            .scale(y_scale)
            .orient("left");
        
        svg.select('g.axis')
            .transition().duration(700)
            .call(y_axis);
        
        /* Equations used to find out the number of circles per column */
        /*
           Let N be the # of circles per column, we have:
               Bar Width = N * RADIUS * 2  (for N circles)
                         + (N + 1) * RADIUS * SKIP (for N + 1 empty space)
           Therefore, to calculate N given Bar Width:
               N = ((Bar Width) / RADIUS - SKIP) / (SKIP + 2)
        */            
        var bar_width = y_scale.rangeBand();
        var n_c_col = Math.floor((bar_width / RADIUS - SKIP) / (SKIP + 2));
        
        /* preparing data for circles in different groups */
        var nested = d3.nest()
            .key(function(d) { return d['Survived']; })
            .key(function(d) { return d[group_by]; })
            .entries(data)
            
        var count = Array()
            
        for (var i = 0; i <= 1; i++) {
            for (var j = 0; j < nested[i].values.length; j++) {
                draw_circles(g_cir, nested[i].values[j].values, group_by, 
                        y_scale, n_c_col);
                
                /* preparing data for count labels */
                count.push({
                    'Survived': nested[i].key,
                    'Group': nested[i].values[j].key,
                    'Count': nested[i].values[j].values.length
                });
            }
        }
        
        var count_labels = g_count.selectAll('text')
            .data(count, function(d) {
                return d.Survived + d.Group;
            });
        
        function count_x_pos(d) {
            return get_x_pos(d.Survived, d.Count + n_c_col * 2 - 1, n_c_col);
        }
        
        function count_y_pos(d) {
            var start = get_y_pos(d.Group, 0, n_c_col, y_scale);
            var end = get_y_pos(d.Group, n_c_col - 1, n_c_col, y_scale);
            return (start + end) / 2.0;
        }
        
        count_labels.enter().append('text')
            .attr('class', function(d) {
                return is_surv(d.Survived) ? 'surv' : 'died';
            })
            .attr('x', count_x_pos)
            .attr('y', count_y_pos)
            .text(function(d) {
                return d.Count;
            })
        
        count_labels.transition().duration(350)
            .attr('opacity', '0');
            
        count_labels.attr('x', count_x_pos)
            .attr('y', count_y_pos)
            .transition().delay(350).duration(350)
            .attr('opacity', '1');
        
        count_labels.exit()
            .transition().duration(350)
            .attr('opacity', '0')
            .remove();
    } 
    
    show(DEFAULT_GROUP, data, svg, g_cir, g_count);
    
    buttons.on("click", function(d) {
        d3.select("table.button")
            .selectAll("a")
            .style("border", "1.5px solid lightgray");

        d3.select(this)
            .style("border", "1.5px solid orangered");
            
        show(text_to_group[d], data, svg, g_cir, g_count);
    });

};