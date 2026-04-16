import { Outlet } from "react-router";
import { Header } from "./header/index";
import styles from "./layout.module.css";
import { Sidebar } from "./sidebar/index";
import { useMe } from "../../lib/queries";

export function AppLayout() {

    const {
        data: user,
        isLoading,
    } = useMe();

    if (isLoading) {
        return <div>Loading...</div>
    }

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
