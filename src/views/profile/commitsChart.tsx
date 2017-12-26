import * as React from "react";
import * as echarts from "echarts/lib/echarts";
import moment from "moment";

const styles = require("./styles/userInfo.less");

interface CommitsChartProps {
    commits: string[];
}

interface CommitsChartState {}

export default class CommitsChart extends React.Component<CommitsChartProps, CommitsChartState> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { commits } = this.props;
        // count commits by day
        const dates: string[] = [];
        const countsMap: { [date: string]: number } = {};
        commits.forEach(commit => {
            const date = commit;
            if (dates[dates.length - 1] !== date) {
                dates.push(date);
            }

            const lastCount = countsMap[date];
            if (lastCount) {
                countsMap[date] = lastCount + 1;
            } else {
                countsMap[date] = 1;
            }
        });

        const today = moment().format("YYYY/MM/DD");
        if (dates[dates.length - 1] !== today) {
            dates.push(today);
        }

        const counts = dates.map(date => countsMap[date] || 0);

        const commitsChart = echarts.init(document.getElementById("commitsChart"));
        commitsChart.setOption({
            grid: {
                x: 35,
                y: 10,
                x2: 10,
                y2: 60
            },
            tooltip: {
                trigger: "axis",
                position: function(pt) {
                    return [pt[0] - 100, "5%"];
                }
            },
            title: {
                show: true,
                left: "center",
                top: 10,
                text: "Commits trend",
                textStyle: {
                    fontFamily: "Barlow Semi Condensed"
                }
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: "none"
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: "category",
                boundaryGap: false,
                data: dates
            },
            yAxis: {
                type: "value",
                boundaryGap: [0, "30%"],
                min: 0,
                minInterval: 10
            },
            dataZoom: [
                {
                    type: "inside",
                    start: 80,
                    end: 100
                },
                {
                    start: 80,
                    end: 100,
                    handleIcon:
                        "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                    handleSize: "80%",
                    handleStyle: {
                        color: "#fff",
                        shadowBlur: 3,
                        shadowColor: "rgba(0, 0, 0, 0.6)",
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                }
            ],
            series: [
                {
                    name: "Commits",
                    type: "line",
                    smooth: true,
                    symbol: "none",
                    sampling: "average",
                    itemStyle: {
                        normal: {
                            color: "#8d98b3"
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: "#59678c"
                                },
                                {
                                    offset: 1,
                                    color: "#8d98b3"
                                }
                            ])
                        }
                    },
                    data: counts
                }
            ]
        });
    }

    render() {
        return <div className={styles.commitsChart} id="commitsChart" />;
    }
}
