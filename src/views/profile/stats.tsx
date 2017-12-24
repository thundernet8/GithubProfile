import * as React from "react";
import { inject, observer } from "mobx-react";
import GlobalStore from "../../shared/store/GlobalStore";

const styles = require("./styles/stats.less");

interface StatsProps {
    store?: GlobalStore;
}

interface StatsState {}

@inject("store")
@observer
export default class Stats extends React.Component<StatsProps, StatsState> {
    private commitsCountSpan: React.ReactDOM;
    private starsCountSpan: React.ReactDOM;
    private followersCountSpan: React.ReactDOM;

    constructor(props) {
        super(props);
    }

    animate = (span, value) => {
        const easeOutQuart = (t, b, c, d) => {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        };

        const time = {
            total: 4000,
            start: performance.now()
        };
        const tick = now => {
            const elapsed = now - time.start;
            const progress = easeOutQuart(elapsed, 0, 1, time.total);

            span.textContent = Math.round(progress * value).toLocaleString();
            if (elapsed < time.total) {
                window.requestAnimationFrame(tick);
            }
        };
        window.requestAnimationFrame(tick);
    };

    refCommitsCountSpan = span => {
        this.commitsCountSpan = span;
        this.starsCountSpan = span;
        this.followersCountSpan = span;
    };

    refStarsCountSpan = span => {
        this.starsCountSpan = span;
    };

    refFollowersCountSpan = span => {
        this.followersCountSpan = span;
    };

    componentDidMount() {
        const store = this.props.store as GlobalStore;
        const { profile, totalStars, totalCommits } = store;

        this.animate(this.commitsCountSpan, totalCommits);
        this.animate(this.starsCountSpan, totalStars);
        this.animate(this.followersCountSpan, profile.basicProfile.followers);
    }

    render() {
        const store = this.props.store as GlobalStore;
        const { profile, totalStars, totalCommits } = store;

        return (
            <div className={styles.wrapper}>
                <div className={styles.stat}>
                    <span>
                        <span className={styles.count} ref={this.refCommitsCountSpan}>
                            {totalStars}
                        </span>Commits submitted
                    </span>
                </div>
                <div className={styles.stat}>
                    <span>
                        <span className={styles.count} ref={this.refStarsCountSpan}>
                            {totalCommits}
                        </span>Stars gained
                    </span>
                </div>
                <div className={styles.stat}>
                    <span>
                        <span className={styles.count} ref={this.refFollowersCountSpan}>
                            {profile.basicProfile.followers}
                        </span>Followers got
                    </span>
                </div>
            </div>
        );
    }
}
