import * as React from "react";
import { inject, observer } from "mobx-react";
import moment from "moment";
import GlobalStore from "../../shared/store/GlobalStore";
import { getTimeDiff } from "../../shared/utils/DateKit";
import CommitsChart from "./commitsChart";

const styles = require("./styles/userInfo.less");

interface UserInfoProps {
    store?: GlobalStore;
}

interface UserInfoState {}

@inject("store")
@observer
export default class UserInfo extends React.Component<UserInfoProps, UserInfoState> {
    constructor(props) {
        super(props);
    }

    renderChart = () => {
        const { profile } = this.props.store as GlobalStore;
        const commits = profile.commits.sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );
        return <CommitsChart commits={commits} />;
    };

    render() {
        const { profile } = this.props.store as GlobalStore;
        if (!profile) {
            return null;
        }

        const { basicProfile } = profile;
        return (
            <div className={styles.wrapper}>
                <div className={styles.avatar}>
                    <img src={basicProfile.avatar} />
                </div>
                <div className={styles.meta}>
                    <div>
                        <i className="fa fa-fw fa-user" />
                        {basicProfile.login}
                        <small>({basicProfile.name})</small>
                    </div>
                    <div>
                        <i className="fa fa-fw fa-database" />
                        {basicProfile.repos} public repos
                    </div>
                    <div>
                        <i className="fa fa-fw fa-clock-o" />Joined Github{" "}
                        {getTimeDiff(moment(basicProfile.join))}
                    </div>
                    <div>
                        <i className="fa fa-fw fa-building" />
                        {basicProfile.location}
                    </div>
                    {basicProfile.blog && (
                        <div>
                            <i className="fa fa-fw fa-pencil" />
                            <a href={basicProfile.blog} target="_blank">
                                {basicProfile.blog}
                            </a>
                        </div>
                    )}
                    <div>
                        <i className="fa fa-fw fa-external-link" />
                        <a href={basicProfile.link} target="_blank">
                            View profile on GitHub
                        </a>
                    </div>
                </div>
                {this.renderChart()}
            </div>
        );
    }
}
