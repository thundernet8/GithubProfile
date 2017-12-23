import * as React from "react";

interface HomeEntryProps {}

interface HomeEntryState {}

export default class HomeEntry extends React.Component<HomeEntryProps, HomeEntryState> {
    static STORE_CLASSES = [];

    constructor(props) {
        super(props);
    }

    render() {
        return <div>HomeEntry</div>;
    }
}
