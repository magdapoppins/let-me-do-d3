var width = 800, height = 600
var nodes = [{}, {}, {}, {}, {}]

var simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody())
  .force('center', d3.forceCenter(width / 2, height / 2))
  .on('tick', ticked);

function ticked() {
	var u = d3.select('svg')
		.selectAll('circle')
		.data(nodes)

	u.enter()
		.append('circle')
		.attr('r', 30)
		.merge(u)
		.attr('cx', function(d) {
			return d.x
		})
		.attr('cy', function(d) {
			return d.y
		})

	u.exit().remove()
}