import * as React from "react";
import { inject, observer } from "mobx-react";
import Loader from "../../common/pageLoader";
import GlobalStore from "../../shared/store/GlobalStore";
import Userinfo from "./userInfo";

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

    render() {
        const { store } = this.props;
        const { loading } = store as GlobalStore;
        return (
            <main className={styles.content}>
                {loading && <Loader text="Analyzing GitHub profile" />}
                {!loading && (
                    <div>
                        <Userinfo />
                    </div>
                )}
            </main>
        );
    }
}
