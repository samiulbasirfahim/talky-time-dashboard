import styles from "../layout.module.css";
import { Notification } from "./notification";
import { Search } from "./search";

export function Header() {
    return (
        <div className={`${styles.layoutHeader} mx-auto container relative`}>
            <Search />
            <Notification />
        </div>
    );
}
