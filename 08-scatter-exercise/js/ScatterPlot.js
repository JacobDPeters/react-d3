// Scatterplot
class ScatterPlot extends React.Component {
    constructor(props) {
        super(props);
        // Graph width and height - accounting for margins
        this.drawWidth = this.props.width - this.props.margin.left - this.props.margin.right;
        this.drawHeight = this.props.height - this.props.margin.top - this.props.margin.bottom;

    }
    componentDidMount() {
        this.update();
    }
    // Whenever the component updates, select the <g> from the DOM, and use D3 to manipulte circles
    componentDidUpdate() {
        this.update();
    }
    updateScales() {
        // Calculate limits
        let xMin = d3.min(this.props.data, (d) => Number(d.x) * .9); //functionally equiv
        let xMax = d3.max(this.props.data, (d) => +d.x * 1.1);
        let yMin = d3.min(this.props.data, (d) => +d.y * .9);
        let yMax = d3.max(this.props.data, (d) => +d.y * 1.1);

        // Define scales
        this.xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, this.drawWidth])
        this.yScale = d3.scaleLinear().domain([yMax, yMin]).range([0, this.drawHeight])
    }
    updatePoints() {
        // Define hovers 
        // Add tip
        let tip = d3.tip().attr('class', 'd3-tip').html(function (d) {
            return d.label;
        });

        // Select all circles and bind data

        let images = d3.select(this.chartArea).selectAll('image').data(this.props.data);
        
        //Use the .enter() method to get your entering elements, and assign their positions
        images.enter().append('image')
            .merge(images)
            //.attr('r', (d) => this.props.radius)
            //.attr('fill', (d) => `url(#${d.label})`)
            .attr('xlink:href', (d) => d.Logo)
            .attr('height', '40px')
            .attr('width', '40px')
            .attr('label', (d) => d.label)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            //.style('fill-opacity', 0.3)
            .transition().duration(500)
            .attr('x', (d) => this.xScale(d.x))
            .attr('y', (d) => this.yScale(d.y))
            .style('stroke', "black")

        // Use the .exit() and .remove() methods to remove elements that are no longer in the data
        images.exit().remove();

        // Add hovers using the d3-tip library        
        d3.select(this.chartArea).call(tip);
    }
    updateAxes() {
        let xAxisFunction = d3.axisBottom()
            .scale(this.xScale)
            .ticks(5, 's');

        let yAxisFunction = d3.axisLeft()
            .scale(this.yScale)
            .ticks(5, 's');

        d3.select(this.xAxis)
            .call(xAxisFunction);

        d3.select(this.yAxis)
            .call(yAxisFunction);
    }
    update() {
        this.updateScales();
        this.updateAxes();
        this.updatePoints();
    }
    render() {
        return (
            <div className="chart-wrapper">
                <svg className="chart" width={this.props.width} height={this.props.height}>
                    <text transform={`translate(${this.props.margin.left},15)`}>{this.props.title}</text>
                    <g ref={(node) => { this.chartArea = node; }}
                        transform={`translate(${this.props.margin.left}, ${this.props.margin.top})`} />

                    {/* Axes */}
                    <g ref={(node) => { this.xAxis = node; }}
                        transform={`translate(${this.props.margin.left}, ${this.props.height - this.props.margin.bottom})`}></g>
                    <g ref={(node) => { this.yAxis = node; }}
                        transform={`translate(${this.props.margin.left}, ${this.props.margin.top})`}></g>

                    {/* Axis labels */}
                    <text className="axis-label" transform={`translate(${this.props.margin.left + this.drawWidth / 2}, 
                        ${this.props.height - this.props.margin.bottom + 30})`}>{this.props.xTitle}</text>

                    <text className="axis-label" transform={`translate(${this.props.margin.left - 30}, 
                        ${this.drawHeight / 2 + this.props.margin.top}) rotate(-90)`}>{this.props.yTitle}</text>
                </svg>
            </div>

        )
    }
}

ScatterPlot.defaultProps = {
    data: [{ x: 10, y: 20 }, { x: 15, y: 35 }],
    width: 800,
    height: 800,
    radius: 20,
    color2: "black",
    margin: {
        left: 50,
        right: 10,
        top: 20,
        bottom: 50
    },
    xTitle: "X Title",
    yTitle: "Y Title",
};