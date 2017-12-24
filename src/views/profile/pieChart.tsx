import * as React from "react";
import * as echarts from "echarts/lib/echarts";

const styles = require("./styles/chart.less");

interface PieChartProps {
    height: number;
    title: string;
    subTitle?: string;
    data: { name: string; description?: string; value: number; url?: string }[];
}

interface PieChartState {}

export default class PieChart extends React.Component<PieChartProps, PieChartState> {
    private container: React.ReactDOM;

    constructor(props) {
        super(props);
    }

    refContainer = container => {
        this.container = container;
    };

    componentDidMount() {
        const { data } = this.props;
        const legends = data.map(item => item.name);

        const chart = echarts.init(this.container);
        chart.setOption({
            grid: {
                x: 5,
                y: 5,
                x2: 5,
                y2: 5
            },
            legend: {
                orient: "vertical",
                left: "0%",
                top: 20,
                data: legends
            },
            tooltip: {
                trigger: "item",
                textStyle: {
                    width: 100
                },
                formatter: params => {
                    const { percent, name, value, dataIndex } = params;
                    const dataItem = data[dataIndex];
                    if (dataItem.description) {
                        return `${name}: ${value} (${percent}%)<br/>${dataItem.description}`;
                    }
                    return `${name}: ${value} (${percent}%)`;
                }
            },
            series: [
                {
                    name: "",
                    type: "pie",
                    center: ["65%", "45%"],
                    radius: ["50%", "80%"],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: "center"
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: "16",
                                fontWeight: "bold"
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data,
                    color: [
                        "#2ec7c9",
                        "#b6a2de",
                        "#5ab1ef",
                        "#ffb980",
                        "#d87a80",
                        "#8d98b3",
                        "#e5cf0d",
                        "#97b552",
                        "#95706d",
                        "#dc69aa",
                        "#07a2a4",
                        "#9a7fd1",
                        "#588dd5",
                        "#f5994e",
                        "#c05050",
                        "#59678c",
                        "#c9ab00",
                        "#7eb00a",
                        "#6f5553",
                        "#c14089"
                    ]
                }
            ]
        });
        chart.on("click", function(params) {
            const item = data[params.dataIndex];
            if (item.url) {
                window.open(item.url, "_blank");
            }
        });
    }

    render() {
        const { height, title, subTitle } = this.props;
        return (
            <div className={styles.chart}>
                <h2>
                    {title} {subTitle && <small>({subTitle})</small>}
                </h2>
                <div className={styles.chartContainer} style={{ height }} ref={this.refContainer} />
            </div>
        );
    }
}
