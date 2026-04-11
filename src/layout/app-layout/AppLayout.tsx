import { Outlet } from "react-router";
import { Header } from "./header/index";
import styles from "./layout.module.css";
import { Sidebar } from "./sidebar/index";

export function AppLayout() {
    return (
        <div className={styles.layoutWrapper}>
            <Header />
            <Sidebar />
            <div className={`${styles.layoutContent} container mx-auto`}>
                <Outlet />
            </div>
        </div>
    );
}
