import * as React from "react";
import DocumentMeta from "react-document-meta";

const styles = require("./styles/index.less");

const bg = require("IMG/404.jpg");

interface NotFoundViewProps {}

interface NotFoundViewState {}

export default class NotFoundView extends React.Component<NotFoundViewProps, NotFoundViewState> {
    constructor(props) {
        super(props);
    }

    render() {
        const meta = {
            title: "404 Not Found - Github Profile",
            description: "",
            meta: {
                charset: "utf-8",
                name: {
                    keywords: "Github Profile"
                }
            },
            link: {
                rel: {
                    stylesheet: "https://fonts.googleapis.com/css?family=Raleway:400,800"
                }
            }
        };

        return (
            <div>
                <DocumentMeta {...meta} />
                <div className={styles.bgBox} style={{ backgroundImage: `url(${bg})` }} />
                <div className={styles.contentBox}>
                    <div className={styles.text}>Something is wrong !</div>
                    <div className={styles.btn}>
                        <a href="/" className="ButtonBox">
                            Go Home
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
