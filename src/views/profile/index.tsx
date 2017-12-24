import * as React from "react";
import { inject, observer } from "mobx-react";
import DocumentMeta from "react-document-meta";
import Loader from "../../common/pageLoader";
import GlobalStore from "../../shared/store/GlobalStore";
import Userinfo from "./userInfo";
import PieChart from "./pieChart";

require("echarts/lib/chart/pie");
require("echarts/lib/chart/line");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/dataZoom");
require("echarts/lib/component/grid");
require("echarts/lib/component/legendScroll");

const styles = require("./styles/index.less");

interface ProfileViewProps {
    store?: GlobalStore;
}

interface ProfileViewState {}

@inject("store")
@observer
export default class ProfileView extends React.Component<ProfileViewProps, ProfileViewState> {
    constructor(props) {
        super(props);
    }

    renderData = () => {
        const { store } = this.props;
        const { profile } = store as GlobalStore;
        const {
            basicProfile,
            repos,
            reposPerLan,
            starsPerLan,
            commitsPerLan,
            commitsPerRepo,
            starsPerRepo
        } = profile;

        const meta = {
            title: `${basicProfile.login}'s github profile summary`,
            description: basicProfile.bio,
            meta: {
                charset: "utf-8",
                name: {
                    keywords: "Github,Github profile"
                }
            }
        };

        return (
            <div>
                <DocumentMeta {...meta} />
                <Userinfo />
                <div className={styles.chartRow}>
                    <PieChart
                        height={250}
                        title="Repos per Language"
                        data={reposPerLan
                            .map(item => ({ name: item.lan, value: item.count }))
                            .slice(0, 6)}
                    />
                    <PieChart
                        height={250}
                        title="Stars per Language"
                        data={starsPerLan
                            .map(item => ({ name: item.lan, value: item.stars }))
                            .slice(0, 6)}
                    />
                    <PieChart
                        height={250}
                        title="Commits per Language"
                        data={commitsPerLan
                            .map(item => ({ name: item.lan, value: item.count }))
                            .slice(0, 6)}
                    />
                </div>
                <div className={styles.chartRow}>
                    <PieChart
                        height={375}
                        title="Commits per Repo"
                        subTitle="top 10"
                        data={commitsPerRepo
                            .map(item => ({
                                name: repos[item.repo].name,
                                description: repos[item.repo].description,
                                value: item.count,
                                url: repos[item.repo].url
                            }))
                            .slice(0, 10)}
                    />
                    <PieChart
                        height={375}
                        title="Stars per Repo"
                        subTitle="top 10"
                        data={starsPerRepo
                            .map(item => ({
                                name: repos[item.repo].name,
                                description: repos[item.repo].description,
                                value: item.stars,
                                url: repos[item.repo].url
                            }))
                            .slice(0, 10)}
                    />
                </div>
            </div>
        );
    };

    render() {
        const { store } = this.props;
        const { loading } = store as GlobalStore;
        return (
            <main className={styles.content}>
                {loading && <Loader text="Analyzing GitHub Profile" />}
                {!loading && this.renderData()}
            </main>
        );
    }
}
