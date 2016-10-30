/**
 * Created by Nahum on 29/10/2016.
 */



function draw_pie_chart(dataToAppend, isText) {
    var width = 960,
        height = 500,
        radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var labelArc = d3.svg.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.value; });
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


    var g = svg.selectAll(".arc")
        .data(pie(dataToAppend))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return color(d.data.key);
        });

    if (isText) {
    g.append("text")
        .attr("transform", function (d) {
            return "translate(" + labelArc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .text(function (d) {
            return d.data.key + "(" + (d.data.value) + ")"
        });
    }
    return svg;
}

d3.text("/data/airbnb.txt",function (text) {


    var data = d3.dsvFormat('|').parse(text);

    var unique_users_per_device =
        d3.nest()
            .key(function (d) {
                return d.dim_device_app_combo.split("-")[0];
            })//by device
            .rollup(function(d){return d3.map(d, function(d) { return d.id_visitor; }).size();})//count uniques and rollup
            .entries(data);

    var unique_users_per_Browser =
        d3.nest()
            .key(function (d) {
                return d.dim_device_app_combo.split("-")[1];
            })//by Browser
            .rollup(function (d) {
                return d3.map(d, function (d) {
                    return d.id_visitor;
                }).size();
            })//count uniques and rollup
            .entries(data);

    var unique_users_by_agent =
        d3.nest()
            .key(function(d) { return d.dim_user_agent; })//by useragent
            .rollup(function(d){return d3.map(d, function(d) { return d.id_visitor; }).size();})//count uniques and rollup
            .sortKeys(d3.ascending)
            .entries(data);

    var svg = draw_pie_chart(unique_users_per_device, true);
    var svg = draw_pie_chart(unique_users_per_Browser, true);
    var svg = draw_pie_chart(unique_users_by_agent, false);
});

