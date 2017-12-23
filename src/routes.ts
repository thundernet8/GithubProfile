/**
 * Generated on Sat, 23 Dec 2017 11:28:22 GMT
 * 本文件由routes.yaml模板生成, 请不要直接修改
 */

import Home from "entries/home";
import Search from "entries/search";
import Profile from "entries/profile";
import NotFound from "entries/notFound";

const routes = [
    { path: "/", redirect: "/search", exact: true, component: Home },
    { path: "/search", exact: true, component: Search },
    { path: "/profile/:username", exact: true, component: Profile },
    { path: "", exact: false, component: NotFound }
];

export default routes;
