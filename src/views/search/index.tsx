import * as React from "react";
import { withRouter } from "react-router-dom";

const styles = require("./styles/index.less");

interface SearchViewProps {
    history: any;
}

interface SearchViewState {
    username: string;
}

class SearchView extends React.Component<SearchViewProps, SearchViewState> {
    constructor(props) {
        super(props);
        this.state = {
            username: ""
        };
    }

    onInputUsername = e => {
        this.setState({
            username: e.target.value.trim()
        });
    };

    onKeyPress = e => {
        if (e.key !== "Enter") {
            return;
        }

        const { username } = this.state;
        if (!username) {
            return;
        }
        this.props.history.push(`/profile/${username}`);
    };

    render() {
        return (
            <main className={styles.content}>
                <div className={styles.searchScreen}>
                    <h1>Enter GitHub username</h1>
                    <form>
                        <input
                            type="text"
                            placeholder="ex. 'thundernet8'"
                            onChange={this.onInputUsername}
                            onKeyPress={this.onKeyPress}
                            required
                        />
                    </form>
                </div>
            </main>
        );
    }
}

const SearchViewWithRouter = withRouter(SearchView);

export default SearchViewWithRouter;
