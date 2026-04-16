import { createBrowserRouter } from "react-router";
import { AppLayout } from "./layout/app-layout/AppLayout";

import {
    NotFound,
    ReportHistory,
    BonusPerformance,
    ScoreCutoffs,
    Settings,
    Operator,
    Dashboard,
    Supervisors,
    Discipline,
    CsvUpload,
    Profile,
    Transactions,
    Payouts,
} from "./pages";
import { Login } from "./pages/login/login";
import { ProtectedRoute } from "./layout/protected.layout";

export const routes = createBrowserRouter([
{
    path: "/login",
    Component: Login,
},
    {
        path: "/",
        element: (
            <ProtectedRoute redirectPath="/login">
                <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, Component: Dashboard },
            {
                path: "supervisor",
                Component: Supervisors,
            },
            {
                path: "operators",
                Component: Operator,
            },

            {
                path: "profile",
                Component: Profile,
            },

            {
                path: "csv-upload",
                Component: CsvUpload,
            },
            {
                path: "score-cutoffs",
                Component: ScoreCutoffs,
            },
            {
                path: "bonus-performance",
                Component: BonusPerformance,
            },
            {
                path: "report-history",
                Component: ReportHistory,
            },
            {
                path: "discipline",
                Component: Discipline,
            },
            {
                path: "settings",
                Component: Settings,
            },
            {
                path: "transactions",
                Component: Transactions,
            },
            {
                path: "payouts",
                Component: Payouts,
            },

            {
                path: "*",
                Component: NotFound,
            },
        ],
    },
]);
