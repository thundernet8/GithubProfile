import * as React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import QrCode from "qrcode.react";
import GlobalStore from "../../shared/store/GlobalStore";

const styles = require("./index.less");

interface ShareBarProps {
    location: any;
    match: any;
}

interface ShareBarState {}

@observer
class ShareBar extends React.Component<ShareBarProps, ShareBarState> {
    constructor(props) {
        super(props);
    }

    render() {
        const { location, match } = this.props;
        const store = GlobalStore.getInstance({
            location,
            match
        });
        const { profile } = store;

        const url = encodeURIComponent(store.URL || "");
        const title = encodeURIComponent(profile.basicProfile.login + "'s github profile summary");
        const weiboShareLink = `https://service.weibo.com/share/share.php?url=${url}&count=1&title=${title}&pic=${
            profile.basicProfile.avatar
        }`;

        const qqShareLink = `http://connect.qq.com/widget/shareqq/index.html?url=${url}&summary=${title}&pics=${
            profile.basicProfile.avatar
        }&flash=&site=Github%20Profile&desc=`;

        return (
            <div className={styles.wrapper}>
                <div className={styles.social}>
                    <a href={weiboShareLink} target="_blank">
                        <i className="fa fa-fw fa-weibo" />
                        Share on Weibo
                    </a>
                    <a href="javascript:;">
                        <i className="fa fa-fw fa-wechat" />
                        Share on Wechat
                        <div className={styles.qr}>
                            <QrCode value={store.URL} size={100} />
                        </div>
                    </a>
                    <a href={qqShareLink} target="_blank">
                        <i className="fa fa-fw fa-qq" />
                        Share on QQ
                    </a>
                </div>
            </div>
        );
    }
}

const ShareBarWithRouter = withRouter(ShareBar);
export default ShareBarWithRouter;
