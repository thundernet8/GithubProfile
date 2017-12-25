import * as React from "react";
import ProfileView from "../views/profile";
import CommonFooter from "../common/footer";
import GlobalStore from "../shared/store/GlobalStore";
import { Provider } from "mobx-react";

interface ProfileEntryProps {
    match: any;
    location: any;
}

interface ProfileEntryState {}

export default class ProfileEntry extends React.Component<ProfileEntryProps, ProfileEntryState> {
    static STORE_CLASSES = [GlobalStore];

    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps) {
        const { location, match } = this.props;
        const { username } = match.params;
        const prevUsername = prevProps.match.params.username;
        if (username !== prevUsername) {
            GlobalStore.rebuild({ location, match });
        }
    }

    componentWillUnmount() {
        GlobalStore.destroy();
    }

    render() {
        const { match, location } = this.props;
        return (
            <>
                <Provider store={GlobalStore.getInstance({ match, location })}>
                    <ProfileView />
                </Provider>
                <CommonFooter />
            </>
        );
    }
}
