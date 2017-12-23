import * as React from "react";
import { inject, observer } from "mobx-react";
import GlobalStore from "../../shared/store/GlobalStore";

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

    render() {
        return <div className={styles.wrapper}>UserInfo</div>;
    }
}
