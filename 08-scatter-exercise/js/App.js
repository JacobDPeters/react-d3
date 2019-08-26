// Application file
class App extends React.Component {
    constructor(props) {
        super(props);

        // Set initial state
        this.state = {
            data: [],
            xVar: "percollege",
            yVar: "percbelowpoverty",
            tax : 'One'
        };
    }

    componentDidMount() {
        // Load data when the component mounts
        d3.csv("data/midwest.csv", (err, data) => {
            this.setState({ data: data });
        });
    }
    render() {

        let {data,tax} = this.state;

        // Get list of possible x and y variables
        let options = data.length === 0 ? [] : Object.keys(data[0]);
        options = options.filter((d) => d !== "county" && d !== "state" && d !== "Taxonomy");

        let taxonomy_set = new Set([]);

        for (let i = 0; i < data.length; i++) {
            let row = data[i].Taxonomy;
            taxonomy_set.add(row);
        }

        let taxonomy_types = Array.from(taxonomy_set);

        // debugger;
        // this.state.data.Taxonomy;
        //debugger;
        //hardcoded list: need to make this dynamic from the "Taxonomy column"
        //let taxfunc = (taxonomy) => 

        //let test = this.state.data.Taxonomy[0];
        //testing console output
        //console.log(this.state.data.filter(d => d.Taxonomy === 'Two'));
        // let tax = this.state.data.Taxonomy === 0 ? [] : Object.keys(this.state.data.Taxonomy);
        //https://stackoverflow.com/questions/42835535/javascript-array-of-dictionaries-get-all-key-value-pairs-from-one-dictionairy?rq=1


        // Store all of the data to be plotted 
        let allData = this.state.data.map((d) => {
            return {
                x: d[this.state.xVar],
                y: d[this.state.yVar],
                label: d.county + "-" + d.state,
                //selected: d.Taxonomy.toLowerCase().match(this.state.tax.toLowerCase()) != null && this.state.tax !== '',
                Taxonomy: d.Taxonomy,
                Logo: d.Logo
                //can pass through more.

            };
        });
        console.log(tax)
        allData = allData.filter((row) => row.Taxonomy === tax);



        // let runFilter = (arr,filter) => {
        //     return {
        //         arr.filter(d => {return d[filter.key] == filter.value
        //         })
        //     }
        // };

        //https://itnext.io/one-approach-to-filtering-a-d3-interactive-dashboard-f63e0244f77d

        return (
            <div className="container">
                <div className="control-container">

                    {/* X Variable Select Menu */}
                    <div className="control-wrapper">
                        <label htmlFor="xVar">X test Variable:</label>
                        <select id="xVar" value={this.state.xVar} className="custom-select" onChange={(d) => this.setState({ xVar: d.target.value })}>
                            {options.map((d) => {
                                return <option key={d}>{d}</option>
                            })}
                        </select>
                    </div>

                    {/* Y Variable Select Menu */}
                    <div className="control-wrapper">
                        <label htmlFor="yVar">Y test Variable:</label>
                        <select id="yVar" value={this.state.yVar} className="custom-select" onChange={(d) => this.setState({ yVar: d.target.value })}>
                            {options.map((d) => {
                                return <option key={d}>{d}</option>
                            })}
                        </select>
                    </div>

                {/* Taxonomy Select Menu */}
                    <div className="control-wrapper">
                        <label htmlFor="tax">Taxonomy:</label>
                        <select id="Taxonomy" value={this.state.Taxonomy} className="custom-select" onChange={(d) => this.setState({ tax: d.target.value })}>
                            {taxonomy_types.map((d) => {
                                return <option key={d}>{d}</option>
                            })}
                        </select>
                    </div>


                </div>

                {/* Render scatter plot */}
                <ScatterPlot
                    xTitle={this.state.xVar}
                    yTitle={this.state.yVar}
                    data={allData}
                    />
            </div>
        )
    }
}

// Render application
ReactDOM.render(
    <App />,
    document.getElementById('root')
);